from typing import Optional

from model.entities import Entities
from pydantic import BaseModel, Field
from pynamodb.attributes import NumberAttribute, UnicodeAttribute


class TicketType(Entities, discriminator='TicketType'):
    # hk: Entities#<eventId>
    # rk: v<version_number>#<entry_id>

    name = UnicodeAttribute(null=False)
    description = UnicodeAttribute(null=False)
    tier = UnicodeAttribute(null=False)
    originalPrice = NumberAttribute(null=True)
    price = NumberAttribute(null=False)
    maximumQuantity = NumberAttribute(null=False)

    currentSales = NumberAttribute(default=0)

    eventId = UnicodeAttribute(null=False)
    konfhubId = UnicodeAttribute(null=True)


class TicketTypeIn(BaseModel):
    name: Optional[str] = Field(None, title='Name')
    description: Optional[str] = Field(None, title='Description')
    tier: Optional[str] = Field(None, title='Tier')
    originalPrice: Optional[float] = Field(None, title='Original Price')
    price: Optional[float] = Field(None, title='Price')
    maximumQuantity: Optional[int] = Field(None, title='Maximum Quantity')
    eventId: Optional[str] = Field(None, title='Event ID')
    konfhubId: Optional[str] = Field(None, title='Konfhub ID', exclude=True)


class TicketTypeOut(TicketTypeIn):
    currentSales: int = Field(None, title='Current Sales')
