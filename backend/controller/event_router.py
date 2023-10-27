from http import HTTPStatus
from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path
from model.common import Message
from model.events.event import EventIn, EventOut
from model.file_uploads.file_upload import FileUploadOut
from model.file_uploads.file_upload_constants import FileUploadConstants, EventUploadTypes
from usecase.event_usecase import EventUsecase

event_router = APIRouter()


@event_router.get(
    '',
    response_model=List[EventOut],
    responses={
        404: {"model": Message, "description": "Event not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get events",
)
@event_router.get(
    '/',
    response_model=List[EventOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_events(
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.get_events()


@event_router.get(
    '/{entryId}',
    response_model=EventOut,
    responses={
        404: {"model": Message, "description": "Event not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get event",
)
@event_router.get(
    '/{entryId}/',
    response_model=EventOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_event(
    entry_id: str = Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.get_event(entry_id)


@event_router.post(
    '',
    response_model=EventOut,
    responses={
        400: {"model": Message, "description": "Bad request"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Create event",
)
@event_router.post(
    '/',
    response_model=EventOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def create_event(
    event: EventIn,
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.create_event(event)


@event_router.put(
    '/{entryId}',
    response_model=EventOut,
    responses={
        400: {"model": Message, "description": "Bad request"},
        404: {"model": Message, "description": "Event not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Update event",
)
@event_router.put(
    '/{entryId}/',
    response_model=EventOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_event(
    event: EventIn,
    entry_id: str = Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.update_event(entry_id, event)


@event_router.delete(
    '/{entryId}',
    status_code=HTTPStatus.NO_CONTENT,
    responses={
        204: {'description': 'Event entry deletion success', 'content': None},
    },
    summary="Delete event",
)
@event_router.delete(
    '/{entryId}/',
    status_code=HTTPStatus.NO_CONTENT,
    include_in_schema=False,
)
def delete_event(
    entry_id: str = Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.delete_event(entry_id)

@event_router.get(
    '/{entryId}/upload/{uploadType}',
    response_model=FileUploadOut,
    responses={
        500: {"model": Message, "description": "Interal server error" }
    },
    summary="Get presigned URL",
)
@event_router.get(
    '/{entryId}/upload/{uploadType}/',
    response_model=FileUploadOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_presigned_url(
    entry_id: str = Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID),
    upload_type: EventUploadTypes = Path(..., title='Upload Type', alias=FileUploadConstants.UPLOAD_TYPE)
):
    events_uc = EventUsecase()
    return events_uc.generate_presigned_url(entry_id, upload_type.value)
