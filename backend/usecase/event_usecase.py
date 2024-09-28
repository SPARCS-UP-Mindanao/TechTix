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
from repository.ticket_type_repository import TicketTypeRepository
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
        self.__ticket_type_repository = TicketTypeRepository()

    def create_event(self, event_in: EventIn) -> Union[JSONResponse, EventOut]:
        """Create a new event

        :param event_in: The event data to create.
        :type event_in: EventIn

        :return: The created event or an error message.
        :rtype: Union[JSONResponse, EventOut]

        """
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

        if event_in.ticketTypes:
            for ticket_type in event_in.ticketTypes:
                ticket_type.eventId = event.eventId
                status, ticket_type, message = self.__ticket_type_repository.store_ticket_type(ticket_type)
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
        """Update an existing event.

        :param event_id: The ID of the event to update.
        :type event_id: str

        :param event_in: The new event data.
        :type event_in: EventIn

        :return: The updated event or an error message.
        :rtype: Union[JSONResponse, EventOut]

        """
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        original_event = deepcopy(event)
        original_status = original_event.status

        status, update_event, message = self.__events_repository.update_event(event_entry=event, event_in=event_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        if event_in.ticketTypes:
            status, ticket_types_entries, message = self.__ticket_type_repository.query_ticket_types(event_id=event_id)
            if status != HTTPStatus.OK:
                return JSONResponse(status_code=status, content={'message': message})

            ticket_types_map = {ticket_type.entryId: ticket_type for ticket_type in ticket_types_entries}
            for ticket_type in event_in.ticketTypes:
                ticket_type_entry = ticket_types_map.get(ticket_type.entryId)
                if not ticket_type_entry:
                    return JSONResponse(
                        status_code=HTTPStatus.BAD_REQUEST,
                        content={'message': f'Ticket type {ticket_type.name} not found'},
                    )

                status, ticket_type, message = self.__ticket_type_repository.update_ticket_type(
                    ticket_type_entry=ticket_type_entry, ticket_type_in=ticket_type
                )
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
                event=event,
                claim_certificate_url=claim_certificate_url,
                participants=participants,
            )

        event_data = self.__convert_data_entry_to_dict(update_event)
        event_out = EventOut(**event_data)
        return self.collect_pre_signed_url(event_out)

    def get_event(self, event_id: str) -> Union[JSONResponse, EventOut]:
        """Get an event by its ID

        :param event_id: The ID of the event to get.
        :type event_id: str

        :return: The requested event or an error message.
        :rtype: Union[JSONResponse, EventOut]

        """
        status, event, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_data = self.__convert_data_entry_to_dict(event)
        event_out = EventOut(**event_data)
        return self.collect_pre_signed_url(event_out)

    def get_events(self, admin_id: str = None) -> Union[JSONResponse, List[EventOut]]:
        """Get all events or all events for a specific admin

        :param admin_id: The ID of the admin to get events for.
        :type admin_id: str, optional

        :return: The requested events or an error message.
        :rtype: Union[JSONResponse, List[EventOut]]

        """
        if admin_id:
            status, events, message = self.__events_repository.query_events_by_admin_id(admin_id)
        else:
            status, events, message = self.__events_repository.query_events()

        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        events_data = [self.__convert_data_entry_to_dict(event) for event in events]
        return [self.collect_pre_signed_url(EventOut(**event_data)) for event_data in events_data]

    def delete_event(self, event_id: str) -> Union[None, JSONResponse]:
        """Delete an event by its ID

        :param event_id: The ID of the event to delete.
        :type event_id: str

        :return: None if successful, otherwise an error message.
        :rtype: Union[None, JSONResponse]

        """
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
        """Update an event after an S3 upload

        :param object_key: The object key of the uploaded file.
        :type object_key: str

        :return: The updated event or an error message.
        :rtype: Union[JSONResponse, EventOut]

        """
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
        """Collect pre-signed URLs for an event.

        :param event: The event to collect pre-signed URLs for.
        :type event: EventOut

        :return: The event with pre-signed URLs.
        :rtype: EventOut

        """
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
        """Convert a data entry to a dictionary.

        :param data_entry: The data entry to convert.
        :type data_entry: str

        :return: The converted data entry.
        :rtype: dict

        """
        return json.loads(data_entry.to_json())
