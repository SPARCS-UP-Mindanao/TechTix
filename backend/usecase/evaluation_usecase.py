import json
from http import HTTPStatus
from typing import List, Union

from model.evaluations.evaluation import EvaluationIn, EvaluationOut
from repository.evaluations_repository import EvaluationRepository
from starlette.responses import JSONResponse

class EvaluationUsecase:
    def __init__(self):
        self.__evaluations_repository = EvaluationRepository()
    
    def create_evaluation(self, evaluation_in: EvaluationIn) -> Union[JSONResponse, EvaluationOut]:
        status, evaluation, message = self.__evaluations_repository.store_evaluation(evaluation_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        evaluation_data = self.__convert_data_entry_to_dict(evaluation)
        return EvaluationOut(**evaluation_data)

    def update_evaluation(self, event_id: str, registration_id: str, question: str, evaluation_in: EvaluationIn) -> Union[JSONResponse, EvaluationOut]:
        status, evaluation, message = self.__evaluations_repository.query_evaluations(event_id, registration_id, question)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})


        status, update_evaluation, message = self.__evaluations_repository.update_evaluation(evaluation_entry=evaluation, evaluation_in=evaluation_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})
        
        evaluation_data = self.__convert_data_entry_to_dict(update_evaluation)
        return EvaluationOut(**evaluation_data)
    
    def get_evaluation(self, event_id: str, registration_id: str, question: str, evaluation_in: EvaluationIn) -> Union[JSONResponse, EvaluationOut]:
        status, evaluation, message = self.__evaluations_repository.query_evaluations(event_id,registration_id,question)
        evaluation = evaluation[0] # since query_evaluations returns a list
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        evaluations_data = self.__convert_data_entry_to_dict(evaluation)
        return EvaluationOut(**evaluations_data)

    def get_evaluations(self, event_id: str = None, registration_id: str = None, question: str = None) -> Union[JSONResponse, List[EvaluationOut]]:
        status, evaluations, message = self.__evaluations_repository.query_evaluations(event_id, registration_id, question)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        evaluations_data = [self.__convert_data_entry_to_dict(evaluation) for evaluation in evaluations]
        return [EvaluationOut(**evaluations_data) for evaluations_data in evaluations_data]

    def get_evaluations_by_question(self, event_id: str, question: str) -> Union[JSONResponse, List[EvaluationOut]]:
        status, evaluations, message = self.__evaluations_repository.query_evaluations_by_question(event_id, question)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        evaluations_data = [self.__convert_data_entry_to_dict(evaluation) for evaluation in evaluations]
        return [EvaluationOut(**evaluations_data) for evaluations_data in evaluations_data]

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        return json.loads(data_entry.to_json())