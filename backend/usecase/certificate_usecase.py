import json
import os
from datetime import datetime
from http import HTTPStatus
from typing import Tuple, Union

from boto3 import client as boto3_client
from model.certificates.certificate import CertificateIn, CertificateOut
from model.events.events_constants import EventStatus
from model.registrations.registration import RegistrationPatch
from repository.events_repository import EventsRepository
from repository.registrations_repository import RegistrationsRepository
from starlette.responses import JSONResponse
from usecase.file_s3_usecase import FileS3Usecase
from utils.logger import logger


class CertificateUsecase:
    def __init__(self):
        self.__registrations_repository = RegistrationsRepository()
        self.__events_repository = EventsRepository()
        self.__file_s3_usecase = FileS3Usecase()
        self.__sqs_client = boto3_client('sqs', region_name=os.getenv('REGION', 'ap-southeast-1'))
        self.__sqs_url = os.getenv('CERTIFICATE_QUEUE')

    def generate_certificates(self, event_id: str, registration_id: str = None) -> Tuple[HTTPStatus, str]:
        """Generate certificates for an event

        :param event_id: The id of the event
        :type event_id: str

        :param registration_id: The id of the registration
        :type registration_id: str

        :return: The status and message
        :rtype: Tuple[HTTPStatus, str]

        """
        message = None
        try:
            timestamp = datetime.utcnow().isoformat(timespec='seconds')
            payload = {'eventId': event_id}
            message_group_id = f'sparcs-certificates-{event_id}'
            message_dedup_id = f'sparcs-certificates-{event_id}-{timestamp}'

            if registration_id:
                payload['registrationId'] = registration_id
                message_group_id += f'-{registration_id}'
                message_dedup_id += f'-{registration_id}'

            response = self.__sqs_client.send_message(
                QueueUrl=self.__sqs_url,
                MessageBody=json.dumps(payload),
                MessageDeduplicationId=message_dedup_id,
                MessageGroupId=message_group_id,
            )

            message_id = response.get('MessageId')
            message = f'Queue message success: {message_id}'
            logger.info(message)

        except Exception as e:
            message = f'Failed to send email: {str(e)}'
            logger.error(message)
            return HTTPStatus.INTERNAL_SERVER_ERROR, message

        else:
            return HTTPStatus.OK, message

    def claim_certificate(self, event_id: str, certificate_in: CertificateIn) -> Union[JSONResponse, CertificateOut]:
        """Claim a certificate

        :param event_id: The id of the event
        :type event_id: str

        :param certificate_in: The certificate to be claimed
        :type certificate_in: CertificateIn

        :return: The claimed certificate
        :rtype: Union[JSONResponse, CertificateOut]

        """
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        if event.status != EventStatus.COMPLETED.value:
            return JSONResponse(
                status_code=400,
                content={'message': f'Event {event_id} is not open for evaluation yet.'},
            )

        if not event.certificateTemplate:
            return JSONResponse(
                status_code=400,
                content={'message': f'Certificate template of eventId {event_id} not found.'},
            )

        (
            status,
            registrations,
            message,
        ) = self.__registrations_repository.query_registrations_with_email(
            event_id=event_id, email=certificate_in.email
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        # Generate Certificate---------------------
        registration = registrations[0]
        if not registration.certificateGenerated:
            self.generate_certificates(event_id=event_id, registration_id=registration.registrationId)

            (
                status,
                registration,
                message,
            ) = self.__registrations_repository.update_registration(
                registration_entry=registration,
                registration_in=RegistrationPatch(certificateGenerated=True),
            )
            if status != HTTPStatus.OK:
                return JSONResponse(status_code=status, content={'message': message})

        is_first_claim = not registration.certificateClaimed

        # img_download_url_response = self.__file_s3_usecase.create_download_url(
        #     object_key=registration.certificateImgObjectKey
        # )
        # img_download_url = img_download_url_response.downloadLink if img_download_url_response else None

        # pdf_download_url_response = self.__file_s3_usecase.create_download_url(
        #     object_key=registration.certificatePdfObjectKey
        # )
        # img_download_url = pdf_download_url_response.downloadLink if pdf_download_url_response else None

        return CertificateOut(
            isFirstClaim=is_first_claim,
            # certificateTemplate=img_download_url,
            # certificatePDFTemplate=img_download_url,
            certificateTemplateKey=registration.certificateImgObjectKey,
            certificatePDFTemplateKey=registration.certificatePdfObjectKey,
            registrationId=registration.registrationId,
        )
