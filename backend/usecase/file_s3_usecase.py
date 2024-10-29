import os
from typing import Tuple

from boto3 import client as boto3_client
from botocore.config import Config
from botocore.exceptions import ClientError
from model.events.events_constants import EventUploadField, EventUploadType
from model.file_uploads.file_upload import FileDownloadOut, FileUploadOut
from model.file_uploads.file_upload_constants import ClientMethods
from starlette.responses import JSONResponse
from utils.logger import logger


class FileS3Usecase:
    def __init__(self):
        self.__s3_client = boto3_client(
            's3',
            region_name=os.getenv('REGION', 'ap-southeast-1'),
            config=Config(signature_version='s3v4'),
        )
        self.__bucket = os.getenv('S3_BUCKET')
        self.__presigned_url_expiration_time = 30

    def create_presigned_url(self, object_key) -> FileUploadOut:
        """Create a presigned url for uploading files to s3

        :param object_key: The key of the object to be uploaded
        :type object_key: str

        :return: The presigned url and the object key
        :rtype: FileUploadOut
        """
        try:
            presigned_url = self.__s3_client.generate_presigned_url(
                ClientMethod=ClientMethods.PUT_OBJECT,
                Params={'Bucket': self.__bucket, 'Key': object_key},
                ExpiresIn=self.__presigned_url_expiration_time,
            )

            url_data = {'uploadLink': presigned_url, 'objectKey': object_key}

            return FileUploadOut(**url_data)
        except ClientError as e:
            logger.error('Error creating presigned url: %s', e)
            return JSONResponse(status_code=500, content={'message': 'Error creating presigned url'})

    def create_download_url(self, object_key) -> FileDownloadOut:
        """Create a presigned url for downloading files from s3

        :param object_key: The key of the object to be downloaded
        :type object_key: str

        :return: The presigned url and the object key
        :rtype: FileDownloadOut
        """
        try:
            presigned_url = self.__s3_client.generate_presigned_url(
                ClientMethod=ClientMethods.GET_OBJECT,
                Params={'Bucket': self.__bucket, 'Key': object_key},
                ExpiresIn=self.__presigned_url_expiration_time,
            )

            url_data = {'downloadLink': presigned_url, 'objectKey': object_key}

            return FileDownloadOut(**url_data)
        except ClientError as e:
            logger.error('Error creating presigned url: %s', e)
            return None

    def upload_file(self, file_name: str, object_name: str = None, verbose: bool = True) -> bool:
        result = True

        # If S3 object_name was not specified, use file_name
        if object_name is None:
            object_name = file_name

        try:
            self.__s3_client.upload_file(file_name, self.__bucket, object_name)
            if verbose:
                logger.info('Stored file in S3: %s/%s', self.__bucket, object_name)
        except Exception as e:
            message = f'Failed to upload file ({file_name}) to S3, Reason: {type(e).__name__} - {str(e)}'
            logger.error(message)
            # raise PdfServiceInternalError(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, message=message) from e

    def get_values_from_object_key(self, object_key) -> Tuple[str, str]:
        """Get the entry id and upload type from the object key

        :param object_key: The key of the object
        :type object_key: str

        :return: The entry id and the upload type
        :rtype: Tuple[str, str]

        """
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
