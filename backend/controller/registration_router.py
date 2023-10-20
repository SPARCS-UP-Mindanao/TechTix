from http import HTTPStatus
from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path
from model.common import Message
from model.registrations.registration import RegistrationIn, RegistrationOut
from usecase.registration_usecase import RegistrationUsecase

registration_router = APIRouter()

@registration_router.get(
    '',
    response_model=List[RegistrationOut],
    responses={
        404: {"model": Message, "description": "Registration not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get registrations",
)
@registration_router.get(
    '/',
    response_model=List[RegistrationOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_registrations(
    current_user: AccessUser = Depends(get_current_user),
): 
    """
    Get a list of registration entries.

    Args:
        current_user (AccessUser): The current user's authentication details.

    Returns:
        List[RegistrationOut]: A list of registration entries.
    """
    _ = current_user
    registrations_uc = RegistrationUsecase()
    return registrations_uc.get_registrations()


@registration_router.get(
    '/{entryId}',
    response_model=RegistrationOut,
    responses={
        404: {"model": Message, "description": "Registration not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get registration",
)
@registration_router.get(
    '/{entryId}/',
    response_model=RegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_registration(
    entry_id: str = Path(..., title='Registration Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """
    Get a specific registration entry by its ID.

    Args:
        entry_id (str): The unique identifier of the registration entry to be retrieved.
        current_user (AccessUser): The current user's authentication details.

    Returns:
        RegistrationOut: The requested registration entry.
    """
    _ = current_user
    registrations_uc = RegistrationUsecase()
    return registrations_uc.get_registration(entry_id)


@registration_router.post(
    '',
    response_model=RegistrationOut,
    responses={
        400: {"model": Message, "description": "Invalid input"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Create registration",
)
@registration_router.post(
    '/',
    response_model=RegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def create_registration(
    registration_in: RegistrationIn,
    current_user: AccessUser = Depends(get_current_user),
):
    """
    Create a new registration entry.

    Args:
        registration_in (RegistrationIn): The data for creating the new registration entry.
        current_user (AccessUser): The current user's authentication details.

    Returns:
        RegistrationOut: The created registration entry.
    """
    _ = current_user
    registrations_uc = RegistrationUsecase()
    return registrations_uc.create_registration(registration_in)


@registration_router.put(
    '/{entryId}',
    response_model=RegistrationOut,
    responses={
        400: {"model": Message, "description": "Bad request"},
        404: {"model": Message, "description": "Registration not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Update registration",
)
@registration_router.put(
    '/{entryId}/',
    response_model=RegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_registration(
    registration: RegistrationIn,
    entry_id: str = Path(..., title='Registration Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """
    Update an existing registration entry.

    Args:
        registration (RegistrationIn): The updated data for the registration entry.
        entry_id (str): The unique identifier of the registration entry to be updated.
        current_user (AccessUser): The current user's authentication details.

    Returns:
        RegistrationOut: The updated registration entry.
    """
    _ = current_user
    registrations_uc = RegistrationUsecase()
    return registrations_uc.update_registration(entry_id, registration)


@registration_router.delete(
    '/{entryId}',
    status_code=HTTPStatus.NO_CONTENT,
    responses={
        204: {"description": "Joint entry deletion success", 'content': None},
    },
    summary="Delete registration",
)
@registration_router.delete(
    '{entryId}/',
    status_code=HTTPStatus.NO_CONTENT,
    include_in_schema=False,
)
def delete_registration(
    entry_id: str = Path(..., title='Registration Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """
    Delete a specific registration entry by its ID.

    Args:
        entry_id (str): The unique identifier of the registration entry to be deleted.
        current_user (AccessUser): The current user's authentication details.

    Returns:
        None: No return value; the registration entry is deleted.
    """
    _ = current_user
    registrations_uc = RegistrationUsecase()
    return registrations_uc.delete_registration(entry_id)