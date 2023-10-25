import os

from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path
from model.common import Message
from model.file_uploads.file_upload import FileUploadOut
from model.file_uploads.file_upload_constants import UploadTypes, FileUploadConstants

# TO TRANSFER:
from boto3 import client as boto3_client
from botocore.config import Config

# TODO: REMOVE ACCESS KEY IDS
s3_client = boto3_client('s3',
                         region_name=os.getenv('REGION', 'ap-southeast-1'),
                         config=Config(signature_version="s3v4"),
                         # aws_access_key_id=os.getenv('ACCESS_KEY_ID'),
                         # aws_secret_access_key=os.getenv('SECRET_ACCESS_KEY')
                         )

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
    entry_id: str = Path(..., title='Event Id', alias=CommonConstants.ENTRY_ID),
    upload_type: UploadTypes = Path(..., title='Upload Type', alias=FileUploadConstants.UPLOAD_TYPE)
):
    PRESIGNED_URL_EXPIRATION_TIME = 30
    S3_BUCKET = 'sparcs-events-bucket'
    object_key = f'events/{entry_id}/{upload_type.value}'

    presigned_url = s3_client.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            "Bucket": S3_BUCKET,
            "Key": object_key,
        },
        ExpiresIn= PRESIGNED_URL_EXPIRATION_TIME
    )

    return { "uploadLink": presigned_url, "objectKey": object_key }
