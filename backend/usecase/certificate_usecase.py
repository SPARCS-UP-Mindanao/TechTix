from http import HTTPStatus
from typing import Union

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
        download_url_response = self.__file_s3_usecase.create_download_url(object_key=event.certificateTemplate)
        download_url = download_url_response.downloadLink if download_url_response else None

        return CertificateOut(
            isFirstClaim=is_first_claim,
            certificateTemplate=download_url,
            registrationId=registration.registrationId,
        )
