import os

from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path
from model.common import Message
from model.file_uploads.file_upload import FileUploadOut
from model.file_uploads.file_upload_constants import UploadRoutes, UploadTypes, FileUploadConstants
from usecase.file_upload_usecase import FileUploadUsecase

file_upload_router = APIRouter()

# TODO: Auth

@file_upload_router.get(
    '/{uploadType}',
    response_model=FileUploadOut,
    responses={
        500: {"model": Message, "description": "Interal server error" }
    },
    summary="Get presigned URL",
)
@file_upload_router.get(
    '/{uploadType}/',
    response_model=FileUploadOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_presigned_url(
    route: UploadRoutes = Path(..., title='The route', alias=FileUploadConstants.ROUTE),
    entry_id: str = Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID),
    upload_type: UploadTypes = Path(..., title='Upload Type', alias=FileUploadConstants.UPLOAD_TYPE)
):
    file_upload_uc = FileUploadUsecase()
    return file_upload_uc.create_presigned_url(
        object_key=f'{route}/{entry_id}/{upload_type.value}'
    )
