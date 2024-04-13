from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path
from model.common import Message
from model.faqs.faqs import FAQsIn, FAQsOut
from usecase.faqs_usecase import FAQsUsecase

faqs_router = APIRouter()


@faqs_router.get(
    '/{eventId}',
    response_model=FAQsOut,
    responses={
        404: {'model': Message, 'description': 'FAQs not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get FAQs',
)
@faqs_router.get(
    '/{eventId}/',
    response_model=FAQsOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_faqs(
    event_id: str = Path(..., title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """Get FAQs

    :param event_id: The event ID. Defaults to Path(..., title='Event Id', alias=CommonConstants.EVENT_ID).
    :type event_id: str, optional

    :return: FAQsOut object.
    :rtype: FAQsOut

    """
    faqs_uc = FAQsUsecase()
    return faqs_uc.get_faqs(event_id=event_id)


@faqs_router.patch(
    '/{eventId}',
    response_model=FAQsOut,
    responses={
        400: {'model': Message, 'description': 'Bad request'},
        404: {'model': Message, 'description': 'FAQs not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Update faqs',
)
@faqs_router.put(
    '/{eventId}/',
    response_model=FAQsOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_faqs(
    faqs: FAQsIn,
    event_id: str = Path(..., title='Event Id', alias=CommonConstants.EVENT_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """Update FAQs

    :param faqs: FAQsIn object containing the new FAQs data.
    :type faqs: FAQsIn

    :param event_id: The event ID. Defaults to Path(..., title='Event Id', alias=CommonConstants.EVENT_ID).
    :type event_id: str, optional

    :param current_user: The current user, defaults to Depends(get_current_user).
    :type current_user: AccessUser, optional

    :return: FAQsOut object.
    :rtype: FAQsOut

    """
    _ = current_user
    faqs_uc = FAQsUsecase()
    return faqs_uc.create_update_faqs(event_id=event_id, faqs_in=faqs)
