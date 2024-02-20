import json
from http import HTTPStatus
from typing import Union

from model.faqs.faqs import FAQsIn, FAQsOut
from repository.events_repository import EventsRepository
from repository.faqs_repository import FAQsRepository
from starlette.responses import JSONResponse


class FAQsUsecase:
    def __init__(self):
        self.__faqs_repository = FAQsRepository()
        self.__events_repository = EventsRepository()

    def create_update_faqs(self, faqs_in: FAQsIn, event_id: str) -> Union[JSONResponse, FAQsOut]:
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            _,
            faqs,
            _,
        ) = self.__faqs_repository.query_faq_entry(event_id=event_id)

        if faqs:
            (
                status,
                faqs,
                message,
            ) = self.__faqs_repository.update_faqs(faqs_entry=faqs, faqs_in=faqs_in)
        else:
            (
                status,
                faqs,
                message,
            ) = self.__faqs_repository.store_faqs(event_id=event_id, faqs_in=faqs_in)

        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return FAQsOut(**self.__convert_data_entry_to_dict(faqs))

    def get_faqs(self, event_id: str) -> Union[JSONResponse, FAQsOut]:
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, faqs, message = self.__faqs_repository.query_faq_entry(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        faqs_data = self.__convert_data_entry_to_dict(faqs)
        return FAQsOut(**faqs_data)

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        return json.loads(data_entry.to_json())
