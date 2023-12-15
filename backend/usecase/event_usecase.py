import json
import os
from copy import deepcopy
from http import HTTPStatus
from typing import List, Union
from urllib.parse import unquote_plus

from model.events.event import EventIn, EventOut
from model.events.events_constants import EventStatus
from repository.events_repository import EventsRepository
from repository.registrations_repository import RegistrationsRepository
from starlette.responses import JSONResponse
from usecase.certificate_usecase import CertificateUsecase
from usecase.email_usecase import EmailUsecase
from usecase.file_s3_usecase import FileS3Usecase
from utils.logger import logger


class EventUsecase:
    def __init__(self):
        self.__events_repository = EventsRepository()
        self.__email_usecase = EmailUsecase()
        self.__file_s3_usecase = FileS3Usecase()
        self.__registration_repository = RegistrationsRepository()
        self.__certificate_usecase = CertificateUsecase()

    def create_event(self, event_in: EventIn) -> Union[JSONResponse, EventOut]:
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

        if original_status != EventStatus.CLOSED.value and update_event.status == EventStatus.CLOSED.value:
            logger.info(f'Generating certificates triggered for event: {event_id}')
            self.__certificate_usecase.generate_certificates(event_id=event_id)

        elif original_status != EventStatus.COMPLETED.value and update_event.status == EventStatus.COMPLETED.value:
            logger.info(f'Send Thank You Email Triggered for event: {event_id}')
            event_id = update_event.entryId
            claim_certificate_url = f'{os.getenv("FRONTEND_URL")}/{event_id}/evaluate'
            status, registrations, message = self.__registration_repository.query_registrations(event_id=event_id)
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
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_data = self.__convert_data_entry_to_dict(event)
        event_out = EventOut(**event_data)
        return self.collect_pre_signed_url(event_out)

    def get_events(self) -> Union[JSONResponse, List[EventOut]]:
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

        return None

    def update_event_after_s3_upload(self, object_key) -> Union[JSONResponse, EventOut]:
        decoded_object_key = unquote_plus(object_key)
        event_id, upload_type = self.__file_s3_usecase.get_values_from_object_key(decoded_object_key)

        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        fields = {upload_type: decoded_object_key, "status": event.status}  # required

        status, update_event, message = self.__events_repository.update_event_after_s3_upload(
            event_entry=event, event_in=EventIn(**fields)
        )
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
