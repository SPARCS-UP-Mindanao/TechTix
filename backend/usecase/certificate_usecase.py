import json
import logging
import os
from datetime import datetime
from http import HTTPStatus
from typing import Tuple, Union

from boto3 import client as boto3_client
from model.certificates.certificate import CertificateIn, CertificateOut
from repository.events_repository import EventsRepository
from repository.registrations_repository import RegistrationsRepository
from starlette.responses import JSONResponse
from usecase.file_s3_usecase import FileS3Usecase


class CertificateUsecase:
    def __init__(self):
        self.__registrations_repository = RegistrationsRepository()
        self.__events_repository = EventsRepository()
        self.__file_s3_usecase = FileS3Usecase()
        self.__sqs_client = boto3_client("sqs", region_name=os.getenv("REGION", "ap-southeast-1"))
        self.__sqs_url = os.getenv("CERTIFICATE_QUEUE")

    def generate_certificates(self, event_id: str) -> Tuple[HTTPStatus, str]:
        message = None
        try:
            timestamp = datetime.utcnow().isoformat(timespec="seconds")
            payload = {"eventId": event_id}
            response = self.__sqs_client.send_message(
                QueueUrl=self.__sqs_url,
                MessageBody=json.dumps(payload),
                MessageDeduplicationId=f"sparcs-certificates-{event_id}-{timestamp}",
                MessageGroupId=f"sparcs-certificates-{event_id}",
            )
            message_id = response.get("MessageId")
            message = f"Queue message success: {message_id}"
            logging.info(message)

        except Exception as e:
            message = f"Failed to send email: {str(e)}"
            logging.error(message)
            return HTTPStatus.INTERNAL_SERVER_ERROR, message

        else:
            return HTTPStatus.OK, message

    def claim_certificate(self, event_id: str, certificate_in: CertificateIn) -> Union[JSONResponse, CertificateOut]:
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        if not event.certificateTemplate:
            return JSONResponse(
                status_code=400, content={'message': f'Certificate template of eventId {event_id} not found.'}
            )

        status, registrations, message = self.__registrations_repository.query_registrations_with_email(
            event_id=event_id, email=certificate_in.email
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        registration = registrations[0]
        is_first_claim = not registration.certificateClaimed
        img_download_url_response = self.__file_s3_usecase.create_download_url(
            object_key=registration.certificateImgObjectKey
        )
        img_download_url = img_download_url_response.downloadLink if img_download_url_response else None

        pdf_download_url_response = self.__file_s3_usecase.create_download_url(
            object_key=registration.certificatePdfObjectKey
        )
        img_download_url = pdf_download_url_response.downloadLink if pdf_download_url_response else None

        return CertificateOut(
            isFirstClaim=is_first_claim,
            certificateTemplate=img_download_url,
            certificatePDFTemplate=img_download_url,
            certificateTemplateKey=registration.certificateImgObjectKey,
            certificatePDFTemplateKey=registration.certificatePdfObjectKey,
            registrationId=registration.registrationId,
        )
