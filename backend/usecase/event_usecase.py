import json
from http import HTTPStatus
from typing import List, Union

from model.events.event import EventIn, EventOut
from model.file_uploads.file_upload import FileUploadOut
from repository.events_repository import EventsRepository
from starlette.responses import JSONResponse
from usecase.email_usecase import EmailUsecase
from usecase import file_upload_usecase


class EventUsecase:
    def __init__(self):
        self.__events_repository = EventsRepository()
        self.__email_usecase = EmailUsecase()
        self.__file_upload_usecase = file_upload_usecase.FileUploadUsecase()

    def create_event(self, event_in: EventIn) -> Union[JSONResponse, EventOut]:
        status, event, message = self.__events_repository.store_event(event_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        # Queue Event Creation Email
        email_status, message = self.__email_usecase.send_event_creation_email(event)
        if email_status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_data = self.__convert_data_entry_to_dict(event)
        return EventOut(**event_data)

    def update_event(self, event_id: str, event_in: EventIn) -> Union[JSONResponse, EventOut]:
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, update_event, message = self.__events_repository.update_event(event_entry=event, event_in=event_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_data = self.__convert_data_entry_to_dict(update_event)
        return EventOut(**event_data)

    def get_event(self, event_id: str) -> Union[JSONResponse, EventOut]:
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_data = self.__convert_data_entry_to_dict(event)
        return EventOut(**event_data)

    def get_events(self) -> Union[JSONResponse, List[EventOut]]:
        status, events, message = self.__events_repository.query_events()
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        events_data = [self.__convert_data_entry_to_dict(event) for event in events]
        return [EventOut(**event_data) for event_data in events_data]

    def delete_event(self, event_id: str) -> Union[None, JSONResponse]:
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, message = self.__events_repository.delete_event(event_entry=event)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return None

    def generate_presigned_url(self, event_id, upload_type) -> Union[JSONResponse, FileUploadOut]:
        status, _, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        object_key = f'events/{event_id}/{upload_type}'
        status, url_data, message = self.__file_upload_usecase.create_presigned_url(object_key)

        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return FileUploadOut(**url_data)

    def update_event_exclude_metadata(self, event_id: str, event_in: EventIn) -> Union[JSONResponse, EventOut]:
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, update_event, message = self.__events_repository.update_event_exclude_metadata(event_entry=event, event_in=event_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_data = self.__convert_data_entry_to_dict(update_event)
        return EventOut(**event_data)

    def update_fields_after_s3_upload(self, object_key):
        entry_id, fields = self.__get_values_from_object_key(object_key)

        return self.update_event_exclude_metadata(
            event_id=entry_id,
            event_in=EventIn(**fields)
        )


    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        return json.loads(data_entry.to_json())

    # Not sure if I should put this here or on a separate util.py file
    @staticmethod
    def __get_values_from_object_key(object_key):
        object_key_split = object_key.split('/')
        entry_id = object_key_split[1]
        attribute = object_key_split[2]

        if attribute == 'banner':
            attribute = 'bannerLink'
        elif attribute == 'logo':
            attribute = 'logoLink'

        return entry_id, { attribute: object_key }
