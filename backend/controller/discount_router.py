
from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path, Query
from model.common import Message
from model.discount.discount import DiscountIn, DiscountOut
from usecase.discount_usecase import DiscountUsecase

discount_router = APIRouter()

@discount_router.post(
    '',
    response_model=List[DiscountOut],
    responses={
        400: {"model": Message, "description": "Bad request"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Create Discount",
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
    _ = current_user
    discount_uc = DiscountUsecase()
    return discount_uc.create_discounts(discount_in=discount_in)


@discount_router.get(
    '/{entryId}',
    response_model=DiscountOut,
    responses={
        404: {"model": Message, "description": "Discount not found"},
        500: {"model": Message, "description": "Internal server error"},
    },
    summary="Get discounts",
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
):
    discount_uc = DiscountUsecase()
    return discount_uc.get_discount(entry_id=entry_id)
