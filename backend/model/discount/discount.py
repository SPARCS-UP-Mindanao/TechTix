from datetime import datetime

from model.entities import Entities
from pydantic import BaseModel, Extra, Field
from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute


class Discount(Entities, discriminator='Discount'):
    # hk: Discount
    # rk: v<version_number>#<entry_id>
    eventId = UnicodeAttribute(null=True)
    claimed = BooleanAttribute(null=True)
    registrationId = UnicodeAttribute(null=True)
    discountPercentage = NumberAttribute(null=True)


class DiscountDBIn(BaseModel):
    class Config:
        extra = Extra.ignore

    eventId: str = Field(..., title="Event ID")
    claimed: bool = Field(..., title="Claimed")
    registrationId: str = Field(None, title="Registration ID")
    discountPercentage: float = Field(..., title="Discount Percentage")
    entryId: str = Field(..., title="Entry ID")


class DiscountIn(BaseModel):
    class Config:
        extra = Extra.forbid

    eventId: str = Field(..., title="Event ID")
    discountPercentage: float = Field(..., title="Discount Percentage")
    quantity: int = Field(..., title="Quantity")


class DiscountOut(BaseModel):
    class Config:
        extra = Extra.ignore

    entryId: str = Field(..., title="ID")
    createDate: datetime = Field(..., title="Created At")
    updateDate: datetime = Field(..., title="Updated At")
    eventId: str = Field(..., title="Event ID")
    claimed: bool = Field(..., title="Claimed")
    discountPercentage: float = Field(..., title="Discount Percentage")
    registrationId: str = Field(None, title="Registration ID")
