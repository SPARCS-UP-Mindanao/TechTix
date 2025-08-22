from datetime import datetime
from typing import List, Optional

from model.entities import Entities
from model.registrations.registration import RegistrationOut
from pydantic import BaseModel, Extra, Field
from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute


class Discount(Entities, discriminator='Discount'):
    # hk: Discount
    # rk: v<version_number>#<entry_id>
    eventId = UnicodeAttribute(null=True)
    claimed = BooleanAttribute(null=True)
    registrationId = UnicodeAttribute(null=True)
    discountPercentage = NumberAttribute(null=True)
    organizationId = UnicodeAttribute(null=True)
    isReusable = BooleanAttribute(null=True)
    maxDiscountUses = NumberAttribute(null=True)
    currentDiscountUses = NumberAttribute(default=0)
    remainingUses = NumberAttribute(default=0)
    discountName = UnicodeAttribute(null=True)


class DiscountDBIn(BaseModel):
    class Config:
        extra = Extra.ignore

    eventId: str = Field(..., title='Event ID')
    claimed: Optional[bool] = Field(None, title='Claimed')
    registrationId: str = Field(None, title='Registration ID')
    discountPercentage: float = Field(..., title='Discount Percentage')
    entryId: str = Field(..., title='Entry ID')
    organizationId: str = Field(..., title='Organization ID')
    isReusable: bool = Field(..., title='Is Discount Reusable')
    maxDiscountUses: Optional[int] = Field(None, title='Discount Max Uses')
    currentDiscountUses: Optional[int] = Field(0, title='Current Discount Uses')
    remainingUses: Optional[int] = Field(default=0, title='Remaining Discount Uses')
    discountName: Optional[str] = Field(None, title='Discount Name')


class DiscountIn(BaseModel):
    class Config:
        extra = Extra.forbid

    eventId: str = Field(..., title='Event ID')
    discountPercentage: float = Field(..., title='Discount Percentage')
    quantity: Optional[int] = Field(None, title='Quantity')
    organizationName: str = Field(..., title='Organization ID')
    isReusable: bool
    maxDiscountUses: Optional[int] = Field(None, title='Discount Max Uses')
    currentDiscountUses: Optional[int] = Field(0, title='Current Discount Uses')
    remainingUses: Optional[int] = Field(default=0, title='Remaining Discount Uses')
    discountName: Optional[str] = Field(None, title='Discount Name')


class DiscountOut(BaseModel):
    class Config:
        extra = Extra.ignore

    entryId: str = Field(..., title='ID')
    createDate: datetime = Field(..., title='Created At')
    updateDate: datetime = Field(..., title='Updated At')
    eventId: str = Field(..., title='Event ID')
    claimed: Optional[bool] = Field(None, title='Claimed')
    discountPercentage: float = Field(..., title='Discount Percentage')
    registration: RegistrationOut = Field(None, title='Registration ID')
    organizationId: str = Field(..., title='Organization ID')
    maxDiscountUses: Optional[int] = Field(None, title='Discount Max Uses')
    currentDiscountUses: Optional[int] = Field(0, title='Current Discount Uses')
    remainingUses: Optional[int] = Field(None, title='Discount Remaining Uses')


class DiscountOrganization(BaseModel):
    class Config:
        extra = Extra.ignore

    organizationId: str = Field(..., title='Organization ID')
    discounts: List[DiscountOut] = Field(..., title='Discounts')
