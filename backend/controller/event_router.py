from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from fastapi import APIRouter, Depends
from model.common import Message
from model.events.event import EventIn, EventOut
from usecase.event_usecase import EventUsecase
from http import HTTPStatus

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
    '/{event_id}',
    response_model=EventOut,
    responses={
        404: {"model": Message, "description": "Event not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get event",
)
@event_router.get(
    '/{event_id}/',
    response_model=EventOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_event(
    event_id: str,
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.get_event(event_id)


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
    '/{event_id}',
    response_model=EventOut,
    responses={
        400: {"model": Message, "description": "Bad request"},
        404: {"model": Message, "description": "Event not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Update event",
)
@event_router.put(
    '/{event_id}/',
    response_model=EventOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_event(
    event_id: str,
    event: EventIn,
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.update_event(event_id, event)


@event_router.delete(
    '/{event_id}',
    status_code=HTTPStatus.NO_CONTENT,
    responses={
        204: {'description': 'Joint entry deletion success', 'content': None},
    },
    summary="Delete event",
)
@event_router.delete(
    '/{event_id}/',
    status_code=HTTPStatus.NO_CONTENT,
    include_in_schema=False,
)
def delete_event(
    event_id: str,
    current_user: AccessUser = Depends(get_current_user),
):
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.delete_event(event_id)