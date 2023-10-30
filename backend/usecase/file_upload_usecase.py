import os
import logging
from http import HTTPStatus
from typing import Tuple
from model.events.event import EventIn

from model.file_uploads.file_upload_constants import ClientMethods

from boto3 import client as boto3_client
from botocore.config import Config

class FileUploadUsecase:
    def __init__(self):
        self.__s3_client = boto3_client(
                            's3',
                             region_name=os.getenv('REGION', 'ap-southeast-1'),
                             config=Config(signature_version="s3v4"),
                         )
        self.__bucket = os.getenv('S3_BUCKET', 'sparcs-events-bucket')
        self.__presigned_url_expiration_time = 30

    def create_presigned_url(self, object_key) -> Tuple[HTTPStatus, dict, str]:
        try:
            presigned_url = self.__s3_client.generate_presigned_url(
                ClientMethod=ClientMethods.PUT_OBJECT,
                Params={
                    'Bucket': self.__bucket,
                    'Key': object_key
                },
                ExpiresIn= self.__presigned_url_expiration_time
            )

            url_data = { 'uploadLink': presigned_url, 'objectKey': object_key }
        except Exception as e:
            message = f'Failed to create a presigned url: {str(e)}'
            logging.error(message)
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            return HTTPStatus.OK, url_data, None

    def get_values_from_object_key(self, object_key) -> dict:
        object_key_split = object_key.split('/')
        entry_id = object_key_split[1]
        upload_type = object_key_split[2]

        if upload_type == 'banner':
            upload_type = 'bannerLink'
        elif upload_type == 'logo':
            upload_type = 'logoLink'

        return { 
            'entry_id': entry_id,
            'upload_type': upload_type
        }
