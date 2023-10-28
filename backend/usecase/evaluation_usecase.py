import json
from http import HTTPStatus
from typing import List, Union

from model.evaluations.evaluation import EvaluationIn, EvaluationOut, EvaluationPatch
from repository.evaluations_repository import EvaluationRepository
from repository.events_repository import EventsRepository
from repository.registrations_repository import RegistrationsRepository
from starlette.responses import JSONResponse


class EvaluationUsecase:
    def __init__(self):
        self.__evaluations_repository = EvaluationRepository()
        self.__registrations_repository = RegistrationsRepository()
        self.__events_repository = EventsRepository()

    def create_evaluation(self, evaluation_in: EvaluationIn) -> Union[JSONResponse, EvaluationOut]:
        status, _, message = self.__events_repository.query_events(event_id=evaluation_in.eventId)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, __, message = self.__registrations_repository.query_registrations(
            event_id=evaluation_in.eventId, registration_id=evaluation_in.registrationId
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, evaluation, message = self.__evaluations_repository.store_evaluation(evaluation_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        evaluation_data = self.__convert_data_entry_to_dict(evaluation)
        return EvaluationOut(**evaluation_data)

    def update_evaluation(
        self, event_id: str, registration_id: str, question: str, evaluation_in: EvaluationPatch
    ) -> Union[JSONResponse, EvaluationOut]:
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, __, message = self.__registrations_repository.query_registrations(
            event_id=evaluation_in.eventId, registration_id=evaluation_in.registrationId
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, evaluation, message = self.__evaluations_repository.query_evaluations(
            event_id, registration_id, question
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, update_evaluation, message = self.__evaluations_repository.update_evaluation(
            evaluation_entry=evaluation, evaluation_in=evaluation_in
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        evaluation_data = self.__convert_data_entry_to_dict(update_evaluation)
        return EvaluationOut(**evaluation_data)

    def get_evaluation(self, event_id: str, registration_id: str, question: str) -> Union[JSONResponse, EvaluationOut]:
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, evaluation, message = self.__evaluations_repository.query_evaluations(
            event_id, registration_id, question
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        evaluations_data = self.__convert_data_entry_to_dict(evaluation)
        return EvaluationOut(**evaluations_data)

    def get_evaluations(
        self, event_id: str = None, registration_id: str = None, question: str = None
    ) -> Union[JSONResponse, List[EvaluationOut]]:
        if event_id:
            status, _, message = self.__events_repository.query_events(event_id=event_id)
            if status != HTTPStatus.OK:
                return JSONResponse(status_code=status, content={'message': message})

        status, evaluations, message = self.__evaluations_repository.query_evaluations(
            event_id, registration_id, question
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return [EvaluationOut(**self.__convert_data_entry_to_dict(evaluation)) for evaluation in evaluations]

    def get_evaluations_by_question(self, event_id: str, question: str) -> Union[JSONResponse, List[EvaluationOut]]:
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, evaluations, message = self.__evaluations_repository.query_evaluations_by_question(event_id, question)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return [EvaluationOut(**self.__convert_data_entry_to_dict(evaluation)) for evaluation in evaluations]

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        return json.loads(data_entry.to_json())
