from http import HTTPStatus
from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path, Query
from model.common import Message
from model.preregistrations.preregistration import (
    PreRegistrationIn,
    PreRegistrationOut,
    PreRegistrationPatch,
)
from model.file_uploads.file_upload import FileDownloadOut
from pydantic import EmailStr
from usecase.preregistration_usecase import PreRegistrationUsecase

preregistration_router = APIRouter()


@preregistration_router.get(
    "",
    response_model=List[PreRegistrationOut],
    responses={
        404: {"model": Message, "description": "Pre-registration not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get pre-registrations",
)
@preregistration_router.get(
    "/",
    response_model=List[PreRegistrationOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_preregistrations(
    event_id: str = Query(None, title="Event Id", alias=CommonConstants.EVENT_ID),
):
    """Get a list of pre-registration entries

    :param event_id: The event ID. Defaults to Query(None, title='Event Id', alias=CommonConstants.EVENT_ID).
    :type event_id: str, optional

    :return: List of PreRegistrationOut objects.
    :rtype: List[PreRegistrationOut]

    """
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.get_preregistrations(event_id=event_id)


@preregistration_router.get(
    "/{entryId}",
    response_model=PreRegistrationOut,
    responses={
        404: {"model": Message, "description": "Pre-registration not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get pre-registration",
)
@preregistration_router.get(
    "/{entryId}/",
    response_model=PreRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_preregistration(
    entry_id: str = Path(
        ..., title="Pre-registration Id", alias=CommonConstants.ENTRY_ID
    ),
    event_id: str = Query(..., title="Event Id", alias=CommonConstants.EVENT_ID),
):
    """Get a specific pre-registration entry by its ID.

    :param entry_id: The pre-registration ID.
    :type entry_id: str

    :param event_id: The event ID.
    :type event_id: str

    :return: PreRegistrationOut object.
    :rtype: PreRegistrationOut

    """
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.get_preregistration(
        event_id=event_id, preregistration_id=entry_id
    )


@preregistration_router.get(
    "/{email}/email",
    response_model=PreRegistrationOut,
    responses={
        404: {"model": Message, "description": "Pre-registration not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get pre-registration",
)
@preregistration_router.get(
    "/{email}/email/",
    response_model=PreRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_preregistration_by_email(
    email: EmailStr = Path(..., title="Email"),
    event_id: str = Query(..., title="Event Id", alias=CommonConstants.EVENT_ID),
):
    """Get a specific pre-registration email used.

    :param email: The email.
    :type email: EmailStr

    :param event_id: The event ID.
    :type event_id: str

    """
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.get_preregistration_by_email(
        event_id=event_id, email=email
    )


@preregistration_router.post(
    "",
    response_model=PreRegistrationOut,
    responses={
        400: {"model": Message, "description": "Invalid input"},
        409: {
            "model": Message,
            "description": "Pre-registration with email example@example.com already exists",
        },
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Create pre-registration",
)
@preregistration_router.post(
    "/",
    response_model=PreRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def create_preregistration(
    preregistration_in: PreRegistrationIn,
):
    """Create a new pre-registration entry.

    :param preregistration_in: PreRegistrationIn object containing the new pre-registration data.
    :type preregistration_in: PreRegistrationIn

    :return: PreRegistrationOut object.
    :rtype: PreRegistrationOut

    """
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.create_preregistration(preregistration_in)


@preregistration_router.put(
    "/{entryId}",
    response_model=PreRegistrationOut,
    responses={
        400: {"model": Message, "description": "Bad request"},
        404: {"model": Message, "description": "Pre-registration not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Update pre-registration",
)
@preregistration_router.put(
    "/{entryId}/",
    response_model=PreRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_preregistration(
    preregistration: PreRegistrationPatch,
    entry_id: str = Path(
        ..., title="Pre-registration Id", alias=CommonConstants.ENTRY_ID
    ),
    event_id: str = Query(..., title="Event Id", alias=CommonConstants.EVENT_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """Update an existing pre-registration entry.

    :param preregistration: PreRegistrationPatch object containing the new pre-registration data.
    :type preregistration: PreRegistrationPatch

    :param entry_id: The pre-registration ID.
    :type entry_id: str

    :param event_id: The event ID.
    :type event_id: str

    :param current_user: The current user, defaults to Depends(get_current_user).
    :type current_user: AccessUser, optional

    :return: PreRegistrationOut object.
    :rtype: PreRegistrationOut

    """
    _ = current_user
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.update_preregistration(
        event_id=event_id,
        preregistration_id=entry_id,
        preregistration_in=preregistration,
    )


@preregistration_router.delete(
    "/{entryId}",
    status_code=HTTPStatus.NO_CONTENT,
    responses={
        204: {"description": "Pre-registration deletion success", "content": None},
    },
    summary="Delete pre-registration",
)
@preregistration_router.delete(
    "{entryId}/",
    status_code=HTTPStatus.NO_CONTENT,
    include_in_schema=False,
)
def delete_preregistration(
    entry_id: str = Path(
        ..., title="Pre-registration Id", alias=CommonConstants.ENTRY_ID
    ),
    event_id: str = Query(..., title="Event Id", alias=CommonConstants.EVENT_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """Delete a specific registration entry by its ID.

    :param entry_id: The pre-registration ID.
    :type entry_id: str

    :param event_id: The event ID.
    :type event_id: str

    :param current_user: The current user, defaults to Depends(get_current_user).
    :type current_user: AccessUser, optional

    :return: None
    :rtype: None

    """
    _ = current_user
    preregistrations_uc = PreRegistrationUsecase()
    return preregistrations_uc.delete_preregistration(
        preregistration_id=entry_id, event_id=event_id
    )


@preregistration_router.get(
    "/{entryId}/csv_download",
    response_model=FileDownloadOut,
    responses={
        404: {"model": Message, "description": "Pre-registration not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get CSV for pre-registration",
)
@preregistration_router.get(
    "/{eventId}/csv_download/",
    response_model=FileDownloadOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_preregistration_csv(
    event_id: str = Path(..., title="Event Id", alias=CommonConstants.EVENT_ID),
):
    """Get the CSV for a specific event

    :param entry_id: The pre-registration ID.
    :type entry_id: str

    :param event_id: The event ID.
    :type event_id: str

    :return: The csv for the corresponding event
    :rtype: FileDownloadOut

    """
    pass
