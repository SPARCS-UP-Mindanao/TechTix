from http import HTTPStatus
from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path, Query
from model.common import Message
from model.events.event import EventAdminOut, EventIn, EventOut
from model.events.events_constants import EventUploadType
from model.file_uploads.file_upload import FileDownloadOut, FileUploadIn, FileUploadOut
from model.file_uploads.file_upload_constants import FileUploadConstants
from usecase.event_usecase import EventUsecase
from usecase.file_s3_usecase import FileS3Usecase

event_router = APIRouter()


@event_router.get(
    '',
    response_model=List[EventOut],
    responses={
        404: {'model': Message, 'description': 'Event not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get events',
)
@event_router.get(
    '/',
    response_model=List[EventOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_events(
    admin_id: str = Query(None, title='Admin Id', alias=CommonConstants.ADMIN_ID),
):
    """Get events.

    :param admin_id: The admin ID. Defaults to Query(None, title='Admin Id', alias=CommonConstants.ADMIN_ID).
    :type admin_id: str, optional

    :return: List of EventOut objects.
    :rtype: List[Union[EventOut, EventAdminOut]]

    """
    events_uc = EventUsecase()
    return events_uc.get_events(admin_id=admin_id)


@event_router.get(
    '/admin',
    response_model=List[EventAdminOut],
    responses={
        404: {'model': Message, 'description': 'Event not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get admin events',
)
@event_router.get(
    '/admin/',
    response_model=List[EventAdminOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_admin_events(
    admin_id: str = Query(None, title='Admin Id', alias=CommonConstants.ADMIN_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """Get admin events.

    :param admin_id: The admin ID. Defaults to Query(None, title='Admin Id', alias=CommonConstants.ADMIN_ID).
    :type admin_id: str, optional

    :param current_user: The current user, defaults to Depends(get_current_user).
    :type current_user: AccessUser, optional

    :return: List of EventOut, EventAdminOut objects.
    :rtype: List[EventAdminOut]

    """
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.get_events(admin_id=admin_id)


@event_router.get(
    '/{entryId}',
    response_model=EventOut,
    responses={
        404: {'model': Message, 'description': 'Event not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get event',
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
):
    """Get event

    :param entry_id: The event ID. Defaults to Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID).
    :type entry_id: str, optional

    :return: EventOut object.
    :rtype: EventOut

    """
    events_uc = EventUsecase()
    return events_uc.get_event(entry_id)


@event_router.get(
    '/admin/{entryId}',
    response_model=EventAdminOut,
    responses={
        404: {'model': Message, 'description': 'Event not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get event',
)
@event_router.get(
    'admin/{entryId}/',
    response_model=EventAdminOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_admin_event(
    entry_id: str = Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """Get event

    :param entry_id: The event with admin permission.
    :type entry_id: str, optional

    :return: EventOut object.
    :rtype: EventOut

    """
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.get_event(entry_id)


@event_router.post(
    '',
    response_model=EventAdminOut,
    responses={
        400: {'model': Message, 'description': 'Bad request'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Create event',
)
@event_router.post(
    '/',
    response_model=EventAdminOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def create_event(
    event: EventIn,
    current_user: AccessUser = Depends(get_current_user),
):
    """Create event

    :param event: EventIn object containing the new event data.
    :type event: EventIn

    :param current_user: The current user, defaults to Depends(get_current_user).
    :type current_user: AccessUser, optional

    :return: EventOut object.
    :rtype: EventOut

    """
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.create_event(event)


@event_router.put(
    '/{entryId}',
    response_model=EventAdminOut,
    responses={
        400: {'model': Message, 'description': 'Bad request'},
        404: {'model': Message, 'description': 'Event not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Update event',
)
@event_router.put(
    '/{entryId}/',
    response_model=EventAdminOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_event(
    event: EventIn,
    entry_id: str = Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """Update event

    :param event: EventIn object containing the updated event data.
    :type event: EventIn

    :param entry_id: The event ID. Defaults to Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID).
    :type entry_id: str, optional

    :param current_user: The current user, defaults to Depends(get_current_user).
    :type current_user: AccessUser, optional

    :return: EventOut object.
    :rtype: EventOut

    """
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.update_event(entry_id, event)


@event_router.delete(
    '/{entryId}',
    status_code=HTTPStatus.NO_CONTENT,
    responses={
        204: {'description': 'Event entry deletion success', 'content': None},
    },
    summary='Delete event',
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
    """Delete event

    :param entry_id: The event ID. Defaults to Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID).
    :type entry_id: str, optional

    :param current_user: The current user, defaults to Depends(get_current_user).
    :type current_user: AccessUser, optional

    :return: None
    :rtype: None

    """
    _ = current_user
    events_uc = EventUsecase()
    return events_uc.delete_event(entry_id)


@event_router.put(
    '/{entryId}/upload/{uploadType}',
    response_model=FileUploadOut,
    responses={500: {'model': Message, 'description': 'Interal server error'}},
    summary='Get presigned URL',
)
@event_router.put(
    '/{entryId}/upload/{uploadType}/',
    response_model=FileUploadOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_presigned_url(
    upload_in: FileUploadIn,
    entry_id: str = Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID),
    upload_type: EventUploadType = Path(..., title='Upload Type', alias=FileUploadConstants.UPLOAD_TYPE),
):
    """Get presigned URL

    :param upload_in: FileUploadIn object containing the file name.
    :type upload_in: FileUploadIn

    :param entry_id: The event ID. Defaults to Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID).
    :type entry_id: str, optional

    :param upload_type: The upload type. Defaults to Path(..., title='Upload Type', alias=FileUploadConstants.UPLOAD_TYPE).
    :type upload_type: EventUploadType, optional

    :return: FileUploadOut object.
    :rtype: FileUploadOut

    """
    file_s3_uc = FileS3Usecase()
    return file_s3_uc.create_presigned_url(f'events/{entry_id}/{upload_type.value}/{upload_in.fileName}')


@event_router.get(
    '/{entryId}/download',
    response_model=FileDownloadOut,
    responses={500: {'model': Message, 'description': 'Interal server error'}},
    summary='Get download URL',
)
@event_router.get(
    '/{entryId}/download/',
    response_model=FileDownloadOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_download_url(
    object_key: str = Query(None, title='Object key', alias=CommonConstants.OBJECT_KEY),
):
    """Get download URL

    :param object_key: The key of the object. Defaults to Query(None, title='Object key', alias=CommonConstants.OBJECT_KEY).
    :type admin_id: str

    :return: FileDownloadOut object.
    :rtype: FileDownloadOut

    """
    file_s3_uc = FileS3Usecase()
    return file_s3_uc.create_download_url(object_key=object_key)
