import json
import os
import re
from copy import deepcopy
from http import HTTPStatus
from typing import List, Union
from urllib.parse import unquote_plus

from constants.common_constants import CommonConstants
from model.events.event import EventIn, EventOut
from model.events.events_constants import EventStatus
from repository.events_repository import EventsRepository
from repository.faqs_repository import FAQsRepository
from repository.preregistrations_repository import PreRegistrationsRepository
from repository.registrations_repository import RegistrationsRepository
from starlette.responses import JSONResponse
from usecase.email_usecase import EmailUsecase
from usecase.file_s3_usecase import FileS3Usecase
from utils.utils import Utils


class EventUsecase:
    def __init__(self):
        self.__events_repository = EventsRepository()
        self.__email_usecase = EmailUsecase()
        self.__file_s3_usecase = FileS3Usecase()
        self.__registration_repository = RegistrationsRepository()
        self.__preregistration_repository = PreRegistrationsRepository()
        self.__faqs_repository = FAQsRepository()

    def create_event(self, event_in: EventIn) -> Union[JSONResponse, EventOut]:
        slug = Utils.convert_to_slug(event_in.name)
        if re.search(CommonConstants.INVALID_URL_PATTERN, slug):
            return JSONResponse(
                status_code=HTTPStatus.BAD_REQUEST,
                content={'message': f'Event has invalid name: {event_in.name}'},
            )

        status, event, __ = self.__events_repository.query_events(slug)
        if status == HTTPStatus.OK:
            return JSONResponse(
                status_code=HTTPStatus.CONFLICT,
                content={'message': f'Event with name {event_in.name} already exists'},
            )

        event_in.status = EventStatus.DRAFT.value
        status, event, message = self.__events_repository.store_event(event_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        # Queue Event Creation Email
        email_status, message = self.__email_usecase.send_event_creation_email(event)
        if email_status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_data = self.__convert_data_entry_to_dict(event)
        event_out = EventOut(**event_data)
        return self.collect_pre_signed_url(event_out)

    def update_event(self, event_id: str, event_in: EventIn) -> Union[JSONResponse, EventOut]:
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        original_event = deepcopy(event)
        original_status = original_event.status

        status, update_event, message = self.__events_repository.update_event(event_entry=event, event_in=event_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        should_send_accept_reject_emails = (
            original_event.isApprovalFlow
            and original_status != EventStatus.OPEN.value
            and update_event.status == EventStatus.OPEN.value
        )
        if should_send_accept_reject_emails:
            _, preregistrations, _ = self.__preregistration_repository.query_preregistrations(event_id=event_id)
            if preregistrations:
                self.__email_usecase.send_accept_reject_status_email(preregistrations=preregistrations, event=event)

        if original_status != EventStatus.COMPLETED.value and update_event.status == EventStatus.COMPLETED.value:
            event_id = update_event.eventId
            claim_certificate_url = f'{os.getenv("FRONTEND_URL")}/{event_id}/evaluate'
            (
                status,
                registrations,
                message,
            ) = self.__registration_repository.query_registrations(event_id=event_id)
            participants = [entry.email for entry in registrations if not entry.evaluationEmailSent]
            self.__email_usecase.send_event_completion_email(
                event_id=event_id,
                event_name=event.name,
                claim_certificate_url=claim_certificate_url,
                participants=participants,
            )

        event_data = self.__convert_data_entry_to_dict(update_event)
        event_out = EventOut(**event_data)
        return self.collect_pre_signed_url(event_out)

    def get_event(self, event_id: str) -> Union[JSONResponse, EventOut]:
        status, event, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_data = self.__convert_data_entry_to_dict(event)
        event_out = EventOut(**event_data)
        return self.collect_pre_signed_url(event_out)

    def get_events(self, admin_id: str = None) -> Union[JSONResponse, List[EventOut]]:
        if admin_id:
            status, events, message = self.__events_repository.query_events_by_admin_id(admin_id)
        else:
            status, events, message = self.__events_repository.query_events()

        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        events_data = [self.__convert_data_entry_to_dict(event) for event in events]
        return [self.collect_pre_signed_url(EventOut(**event_data)) for event_data in events_data]

    def delete_event(self, event_id: str) -> Union[None, JSONResponse]:
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, message = self.__events_repository.delete_event(event_entry=event)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        _, faqs, _ = self.__faqs_repository.query_faq_entry(event_id)
        if faqs:
            status, message = self.__faqs_repository.delete_faqs(faqs_entry=faqs)
            if status != HTTPStatus.OK:
                return JSONResponse(status_code=status, content={'message': message})

        return None

    def update_event_after_s3_upload(self, object_key) -> Union[JSONResponse, EventOut]:
        decoded_object_key = unquote_plus(object_key)
        event_id, upload_type = self.__file_s3_usecase.get_values_from_object_key(decoded_object_key)

        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        fields = {upload_type: decoded_object_key, 'status': event.status}  # required

        (
            status,
            update_event,
            message,
        ) = self.__events_repository.update_event_after_s3_upload(event_entry=event, event_in=EventIn(**fields))
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_data = self.__convert_data_entry_to_dict(update_event)
        event_out = EventOut(**event_data)
        return self.collect_pre_signed_url(event_out)

    def collect_pre_signed_url(self, event: EventOut):
        if event.bannerLink:
            banner_link = self.__file_s3_usecase.create_download_url(event.bannerLink)
            event.bannerUrl = banner_link.downloadLink

        if event.logoLink:
            logo_link = self.__file_s3_usecase.create_download_url(event.logoLink)
            event.logoUrl = logo_link.downloadLink

        if event.certificateTemplate:
            certificate_template = self.__file_s3_usecase.create_download_url(event.certificateTemplate)
            event.certificateTemplateUrl = certificate_template.downloadLink

        return event

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        return json.loads(data_entry.to_json())
