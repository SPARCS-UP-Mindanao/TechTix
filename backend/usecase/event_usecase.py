import json
from http import HTTPStatus
from typing import List, Union

from model.events.event import EventIn, EventOut
from repository.events_repository import EventsRepository
from starlette.responses import JSONResponse


class EventUsecase:
    def __init__(self):
        self.__events_repository = EventsRepository()

    def create_event(self, event_in: EventIn) -> Union[JSONResponse, EventOut]:
        status, event, message = self.__events_repository.store_event(event_in)
        if status != HTTPStatus.OK:
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

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        return json.loads(data_entry.to_json())
