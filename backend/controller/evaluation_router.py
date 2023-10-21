from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path
from model.common import Message
from model.evaluations.evaluation import EvaluationIn, EvaluationOut
from usecase.evaluation_usecase import EvaluationUsecase

evaluation_router =APIRouter()

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
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.get_evaluations()


@evaluation_router.get(
    '/{entryId}',
    response_model=EvaluationOut,
    responses={
        404: {"model": Message, "description": "Evaluation not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get evaluation",
)
@evaluation_router.get(
    '/{entryId}/',
    response_model=EvaluationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_evaluation(
    entry_id: str = Path(..., title='Evaluation Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.get_evaluation(entry_id)


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
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.create_evaluation(evaluation)


@evaluation_router.put(
    '/{entryId}',
    response_model=EvaluationOut,
    responses={
        400: {"model": Message, "description": "Bad request"},
        404: {"model": Message, "description": "Evaluation not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Update evaluation",
)
@evaluation_router.put(
    '/{entryId}/',
    response_model=EvaluationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_evaluation(
    evaluation: EvaluationIn,
    entry_id: str = Path(..., title='Evaluation Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    evaluations_uc = EvaluationUsecase()
    return evaluations_uc.update_evaluation(entry_id, evaluation)
