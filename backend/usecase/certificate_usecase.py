import json
from http import HTTPStatus

from typing import Union
from repository.registrations_repository import RegistrationsRepository
from model.certificates.certificate import CertificateIn, CertificateOut
from starlette.responses import JSONResponse

class CertificateUsecase:
    
    def __init__(self):
        self.__registrations_repository = RegistrationsRepository()
    
    def claim_certificate(
        self, event_id: str, certificate_in: CertificateIn
    ) -> Union[JSONResponse, CertificateOut]:
        status, event, message = self.__events_repository.query_events(event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})
        
        if event.certificateTemplate == None:
            return JSONResponse(status_code=400, content={'message': f'Certificate template of eventId {event_id} not found.'})
        
        status, registration, message = self.__registrations_repository.query_registrations(
            event_id=event_id, email=certificate_in.email
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return CertificateOut()