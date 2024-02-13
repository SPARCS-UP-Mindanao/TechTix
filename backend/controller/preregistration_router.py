from http import HTTPStatus
from typing import List

from constants.common_constants import CommonConstants
from fastapi import APIRouter, Path, Query
from model.common import Message
from model.preregistrations.preregistration import (
    PreRegistrationIn,
    PreRegistrationOut,
    PreRegistrationPatch,
)
from pydantic import EmailStr
from usecase.preregistration_usecase import PreRegistrationUsecase

preregistration_router = APIRouter()


@preregistration_router.get(
    '',
    response_model=List[PreRegistrationOut],
    responses={
        404: {'model': Message, 'description': 'Pre-registration not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get pre-registrations',
)
@preregistration_router.get(
    '/',
    response_model=List[PreRegistrationOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_preregistration(
    event_id: str = Query(None, title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """
    Get a list of pre-registration entries
    """
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.get_preregistrations(event_id=event_id)


@preregistration_router.get(
    '/{entryId}',
    response_model=PreRegistrationOut,
    responses={
        404: {'model': Message, 'description': 'Pre-registration not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get pre-registration',
)
@preregistration_router.get(
    '/{entryId}/',
    response_model=PreRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_preregistration(
    entry_id: str = Path(..., title='Pre-registration Id', alias=CommonConstants.ENTRY_ID),
    event_id: str = Query(..., title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """
    Get a specific pre-registration entry by its ID.
    """
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.get_preregistration(event_id=event_id, preregistration_id=entry_id)


@preregistration_router.get(
    '/{email}/email',
    response_model=PreRegistrationOut,
    responses={
        404: {'model': Message, 'description': 'Pre-registration not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get pre-registration',
)
@preregistration_router.get(
    '/{email}/email/',
    response_model=PreRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_preregistration_by_email(
    email: EmailStr = Path(..., title='Email'),
    event_id: str = Query(..., title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """
    Get a specific pre-registration email used.
    """
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.get_preregistration_by_email(event_id=event_id, email=email)


@preregistration_router.post(
    '',
    response_model=PreRegistrationOut,
    responses={
        400: {'model': Message, 'description': 'Invalid input'},
        409: {
            'model': Message,
            'description': 'Pre-registration with email example@example.com already exists',
        },
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Create pre-registration',
)
@preregistration_router.post(
    '/',
    response_model=PreRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def create_preregistration(
    preregistration_in: PreRegistrationIn,
):
    """
    Create a new pre-registration entry.
    """
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.create_preregistration(preregistration_in)


@preregistration_router.put(
    '/{entryId}',
    response_model=PreRegistrationOut,
    responses={
        400: {'model': Message, 'description': 'Bad request'},
        404: {'model': Message, 'description': 'Pre-registration not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Update pre-registration',
)
@preregistration_router.put(
    '/{entryId}/',
    response_model=PreRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_preregistration(
    preregistration: PreRegistrationPatch,
    entry_id: str = Path(..., title='Pre-registration Id', alias=CommonConstants.ENTRY_ID),
    event_id: str = Query(..., title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """
    Update an existing pre-registration entry.
    """
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.update_preregistration(
        event_id=event_id, preregistration_id=entry_id, preregistration_in=preregistration
    )
