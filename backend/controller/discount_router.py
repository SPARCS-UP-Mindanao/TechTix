from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path, Query
from model.common import Message
from model.discount.discount import DiscountIn, DiscountOrganization, DiscountOut
from usecase.discount_usecase import DiscountUsecase

discount_router = APIRouter()


@discount_router.post(
    '',
    response_model=List[DiscountOut],
    responses={
        400: {'model': Message, 'description': 'Bad request'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Create Discount',
)
@discount_router.post(
    '/',
    response_model=List[DiscountOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def create_discounts(
    discount_in: DiscountIn,
    current_user: AccessUser = Depends(get_current_user),
):
    """Create discounts.

    :param discount_in: DiscountIn object containing the new discount data.
    :type discount_in: DiscountIn
    
    :param current_user: The current user, defaults to Depends(get_current_user).
    :type current_user: AccessUser, optional
    
    :return: List of DiscountOut objects.
    :rtype: List[DiscountOut]
    
    """
    _ = current_user
    discount_uc = DiscountUsecase()
    return discount_uc.create_discounts(discount_in=discount_in)


@discount_router.get(
    '/{entryId}',
    response_model=DiscountOut,
    responses={
        404: {'model': Message, 'description': 'Discount not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get discounts',
)
@discount_router.get(
    '/{entryId}/',
    response_model=DiscountOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_discount(
    entry_id: str = Path(..., title='Entry Id', alias=CommonConstants.ENTRY_ID),
    event_id: str = Query(..., title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """Get a discount.

    :param entry_id: The entry ID.
    :type entry_id: str
    
    :param event_id: The event ID.
    :type event_id: str
    
    :return: DiscountOut object.
    :rtype: DiscountOut
    
    """
    discount_uc = DiscountUsecase()
    return discount_uc.get_discount(entry_id=entry_id, event_id=event_id)


@discount_router.get(
    '',
    response_model=List[DiscountOrganization],
    responses={
        404: {'model': Message, 'description': 'Discount not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get discounts',
)
@discount_router.get(
    '/',
    response_model=List[DiscountOrganization],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_discounts(
    event_id: str = Query(..., title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """Get a list of discounts.

    :param event_id: The event ID.
    :type event_id: str
    
    :return: List of DiscountOrganization objects.
    :rtype: List[DiscountOrganization]
    
    """
    discount_uc = DiscountUsecase()
    return discount_uc.get_discount_list(event_id=event_id)
