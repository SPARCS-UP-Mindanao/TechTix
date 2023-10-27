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

    def update_event_fields(self, object_key):
        object_key_split = object_key.split('/')
        entry_id = object_key_split[1]
        attribute = object_key_split[2]

        if attribute == 'banner':
            attribute = 'bannerLink'
        elif attribute == 'logo':
            attribute = 'logoLink'

        updated_attribute = {
            attribute: object_key
        }

        # I imported "EventUsecase" here to avoid circular imports
        from usecase.event_usecase import EventUsecase
        event_uc = EventUsecase()
        return event_uc.update_event_exclude_metadata(
            event_id=entry_id,
            event_in=EventIn(**updated_attribute)
        )
