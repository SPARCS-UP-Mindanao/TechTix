import os
from typing import Union

from fastapi.responses import JSONResponse
from model.file_uploads.file_upload import FileUploadOut
from model.file_uploads.file_upload_constants import ClientMethods
from repository.events_repository import EventsRepository

from boto3 import client as boto3_client
from botocore.config import Config

class FileUploadUsecase:
    def __init__(self):
        self.__events_repository = EventsRepository()
        self.s3_client = boto3_client(
                            's3',
                             region_name=os.getenv('REGION', 'ap-southeast-1'),
                             config=Config(signature_version="s3v4"),
                         )
        self.bucket = os.getenv('S3_BUCKET', 'sparcs-events-bucket')
        self.presigned_url_expiration_time = 30

    def create_presigned_url(self, object_key) -> Union[JSONResponse, FileUploadOut]:
        presigned_url = self.s3_client.generate_presigned_url(
            ClientMethod=ClientMethods.PUT_OBJECT,
            Params={
                'Bucket': self.bucket,
                'Key': object_key
            },
            ExpiresIn= self.presigned_url_expiration_time
        )

        response = { 'uploadLink': presigned_url, 'objectKey': object_key }

        return FileUploadOut(**response)

    def update_event_field(self):
        pass




