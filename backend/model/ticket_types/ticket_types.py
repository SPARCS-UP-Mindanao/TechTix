from pydantic import BaseModel, Field
from pynamodb.attributes import NumberAttribute, UnicodeAttribute
from model.entities import Entities

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


class TicketTypeIn(BaseModel):
    name: str = Field(None, title='Name')
    description: str = Field(None, title='Description')
    tier: str = Field(None, title='Tier')
    price: float = Field(None, title='Price')
    maximumQuantity: int = Field(None, title='Maximum Quantity')
    eventId: str = Field(None, title='Event ID')
    entryId: str = Field(None, title='Entry ID')


class TicketTypeOut(TicketTypeIn):
    entryId: str = Field(None, title='Entry ID')
    currentSales: int = Field(None, title='Current Sales')
