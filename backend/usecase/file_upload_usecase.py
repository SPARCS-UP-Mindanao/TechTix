import os
from typing import Tuple

from boto3 import client as boto3_client
from botocore.config import Config
from model.events.events_constants import EventUploadField, EventUploadType
from model.file_uploads.file_upload import FileUploadOut
from model.file_uploads.file_upload_constants import ClientMethods


class FileUploadUsecase:
    def __init__(self):
        self.__s3_client = boto3_client(
            's3',
            region_name=os.getenv('REGION', 'ap-southeast-1'),
            config=Config(signature_version="s3v4"),
        )
        self.__bucket = os.getenv('S3_BUCKET')
        self.__presigned_url_expiration_time = 30

    def create_presigned_url(self, object_key) -> FileUploadOut:
        presigned_url = self.__s3_client.generate_presigned_url(
            ClientMethod=ClientMethods.PUT_OBJECT,
            Params={'Bucket': self.__bucket, 'Key': object_key},
            ExpiresIn=self.__presigned_url_expiration_time,
        )

        url_data = {'uploadLink': presigned_url, 'objectKey': object_key}

        return FileUploadOut(**url_data)

    def get_values_from_object_key(self, object_key) -> Tuple[str, str]:
        object_key_split = object_key.split('/')
        entry_id = object_key_split[1]
        upload_type = object_key_split[2]

        type_to_field_map = {
            EventUploadType.BANNER.value: EventUploadField.BANNER,
            EventUploadType.LOGO.value: EventUploadField.LOGO,
            EventUploadField.CERTIFICATE_TEMPLATE.value: EventUploadField.CERTIFICATE_TEMPLATE,
        }

        upload_type = type_to_field_map[upload_type]

        return entry_id, upload_type.value
