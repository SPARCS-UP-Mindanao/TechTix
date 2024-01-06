from constants.common_constants import CommonConstants
from fastapi import APIRouter, Path
from model.certificates.certificate import CertificateIn, CertificateOut
from model.common import Message
from usecase.certificate_usecase import CertificateUsecase

certificate_router = APIRouter()


@certificate_router.put(
    '/{eventId}/claim',
    response_model=CertificateOut,
    responses={
        404: {'model': Message, 'description': 'Email not found'},
        400: {'model': Message, 'description': 'Certificate template unavailable'},
    },
    summary='Claim certificate',
)
@certificate_router.put(
    '/{eventId}/claim/',
    response_model=CertificateOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_certificate(
    certificate_in: CertificateIn,
    event_id: str = Path(..., title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """
    Handle event certificate claiming.
    """
    certificate_uc = CertificateUsecase()
    return certificate_uc.claim_certificate(event_id=event_id, certificate_in=certificate_in)
