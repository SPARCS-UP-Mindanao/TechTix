from typing import List

from constants.common_constants import CommonConstants
from fastapi import APIRouter, Path, Query
from model.common import Message
from model.evaluations.evaluation import EvaluationIn, EvaluationOut, EvaluationPatch
from usecase.evaluation_usecase import EvaluationUsecase

evaluation_router = APIRouter()


@evaluation_router.get(
    '',
    response_model=List[EvaluationOut],
    responses={
        404: {"model": Message, "description": "Evaluation not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get evaluations",
)
@evaluation_router.get(
    '/',
    response_model=List[EvaluationOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_evaluations(
    event_id: str = Query(None, title='Event Id', alias=CommonConstants.EVENT_ID),
    registration_id: str = Query(None, title="Registration Id"),
):
    """Get Evaluation Entries"""
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.get_evaluations(event_id, registration_id)


@evaluation_router.get(
    '/{eventId}/question/{question}',
    response_model=List[EvaluationOut],
    responses={
        404: {"model": Message, "description": "Evaluation not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get evaluations by question",
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
    question: str = Path(..., title="Question"),
):
    """Get Evaluation Entries by Question"""
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.get_evaluations_by_question(event_id, question)


@evaluation_router.get(
    '/{eventId}/registration/{registrationId}',
    response_model=EvaluationOut,
    responses={
        404: {"model": Message, "description": "Evaluation not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get evaluation",
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
    registration_id: str = Path(..., title="Registration Id", alias=CommonConstants.REGISTRATION_ID),
    question: str = Query(..., title="Question"),
):
    """Get Evaluation Entry"""
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.get_evaluation(event_id, registration_id, question)


@evaluation_router.post(
    '',
    response_model=EvaluationOut,
    responses={
        400: {"model": Message, "description": "Bad request"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Create evaluation",
)
@evaluation_router.post(
    '/',
    response_model=EvaluationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def create_evaluation(
    evaluation: EvaluationIn,
):
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.create_evaluation(evaluation)


@evaluation_router.put(
    '/{eventId}',
    response_model=EvaluationOut,
    responses={
        400: {"model": Message, "description": "Bad request"},
        404: {"model": Message, "description": "Evaluation not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Update evaluation",
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
    registration_id: str = Query(..., title="Registration Id"),
    question: str = Query(..., title="Question"),
):
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.update_evaluation(event_id, registration_id, question, evaluation)
