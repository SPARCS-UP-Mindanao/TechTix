from typing import List

from constants.common_constants import CommonConstants
from fastapi import APIRouter, Path, Query
from model.common import Message
from model.evaluations.evaluation import (
    EvaluationListIn,
    EvaluationListOut,
    EvaluationOut,
    EvaluationPatch,
)
from model.evaluations.evaluations_constants import EvaluationQuestionType
from usecase.evaluation_usecase import EvaluationUsecase

evaluation_router = APIRouter()


@evaluation_router.get(
    '',
    response_model=List[EvaluationListOut],
    responses={
        404: {'model': Message, 'description': 'Evaluation not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get evaluations',
)
@evaluation_router.get(
    '/',
    response_model=List[EvaluationListOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_evaluations(
    event_id: str = Query(None, title='Event Id', alias=CommonConstants.EVENT_ID),
    registration_id: str = Query(None, title='Registration Id'),
):
    """Get Evaluation Entries
    
    :param event_id: The event ID.
    :type event_id: str
    
    :param registration_id: The registration ID.
    :type registration_id: str
    
    :return: List of EvaluationListOut objects.
    :rtype: List[EvaluationListOut]
    
    """
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.get_evaluations(event_id, registration_id)


@evaluation_router.get(
    '/{eventId}/question/{question}',
    response_model=List[EvaluationOut],
    responses={
        404: {'model': Message, 'description': 'Evaluation not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get evaluations by question',
)
@evaluation_router.get(
    '/{eventId}/question/{question}/',
    response_model=List[EvaluationOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_evaluations_by_question(
    event_id: str = Path(..., title='Event Id', alias=CommonConstants.EVENT_ID),
    question: EvaluationQuestionType = Path(..., title='Question'),
):
    """Get Evaluation Entries by Question
    
    :param event_id: The event ID.
    :type event_id: str
    
    :param question: The question.
    :type question: EvaluationQuestionType
    
    :return: List of EvaluationOut objects.
    :rtype: List[EvaluationOut]
    
    """
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.get_evaluations_by_question(event_id, question)


@evaluation_router.get(
    '/{eventId}/registration/{registrationId}',
    response_model=EvaluationOut,
    responses={
        404: {'model': Message, 'description': 'Evaluation not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get evaluation',
)
@evaluation_router.get(
    '/{eventId}/registration/{registrationId}/',
    response_model=EvaluationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_evaluation(
    event_id: str = Path(..., title='Event Id', alias=CommonConstants.EVENT_ID),
    registration_id: str = Path(..., title='Registration Id', alias=CommonConstants.REGISTRATION_ID),
    question: EvaluationQuestionType = Query(..., title='Question'),
):
    """Get Evaluation Entry
    
    :param event_id: The event ID.
    :type event_id: str
    
    :param registration_id: The registration ID.
    :type registration_id: str
    
    :param question: The question.
    :type question: EvaluationQuestionType
    
    :return: EvaluationOut object.
    :rtype: EvaluationOut
    
    """
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.get_evaluation(event_id, registration_id, question)


@evaluation_router.post(
    '',
    response_model=List[EvaluationOut],
    responses={
        400: {'model': Message, 'description': 'Bad request'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Create evaluation',
)
@evaluation_router.post(
    '/',
    response_model=List[EvaluationOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def create_evaluation(
    evaluation: EvaluationListIn,
):
    """Create Evaluation Entry
    
    :param evaluation: EvaluationListIn object containing the new evaluation data.
    :type evaluation: EvaluationListIn
    
    :return: List of EvaluationOut objects.
    :rtype: List[EvaluationOut]
    
    """
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.create_evaluation(evaluation)


@evaluation_router.put(
    '/{eventId}',
    response_model=EvaluationOut,
    responses={
        400: {'model': Message, 'description': 'Bad request'},
        404: {'model': Message, 'description': 'Evaluation not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Update evaluation',
)
@evaluation_router.put(
    '/{eventId}/',
    response_model=EvaluationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_evaluation(
    evaluation: EvaluationPatch,
    event_id: str = Path(..., title='Event Id', alias=CommonConstants.EVENT_ID),
    registration_id: str = Query(..., title='Registration Id'),
    question: EvaluationQuestionType = Query(..., title='Question'),
):
    """Update Evaluation Entry
    
    :param evaluation: EvaluationPatch object containing the updated evaluation data.
    :type evaluation: EvaluationPatch
    
    :param event_id: The event ID.
    :type event_id: str
    
    :param registration_id: The registration ID.
    :type registration_id: str
    
    :param question: The question.
    :type question: EvaluationQuestionType
    
    :return: EvaluationOut object.
    :rtype: EvaluationOut
    
    """
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.update_evaluation(event_id, registration_id, question, evaluation)
