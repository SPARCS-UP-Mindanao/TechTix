from model.entities import Entities
from pydantic import BaseModel, Field
from pynamodb.attributes import NumberAttribute, UnicodeAttribute


class TicketType(Entities, discriminator='TicketType'):
    # hk: Entities#<eventId>
    # rk: v<version_number>#<entry_id>

    name = UnicodeAttribute(null=False)
    description = UnicodeAttribute(null=False)
    tier = UnicodeAttribute(null=False)
    price = NumberAttribute(null=False)
    maximumQuantity = NumberAttribute(null=False)

    currentSales = NumberAttribute(default=0)

    eventId = UnicodeAttribute(null=False)
    konfhubId = UnicodeAttribute(null=False)


class TicketTypeIn(BaseModel):
    name: str = Field(None, title='Name')
    description: str = Field(None, title='Description')
    tier: str = Field(None, title='Tier')
    price: float = Field(None, title='Price')
    maximumQuantity: int = Field(None, title='Maximum Quantity')
    eventId: str = Field(None, title='Event ID')
    konfhubId: str = Field(None, title='Konfhub ID')


class TicketTypeOut(TicketTypeIn):
    currentSales: int = Field(None, title='Current Sales')
