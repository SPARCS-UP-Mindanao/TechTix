from datetime import datetime

from model.entities import Entities
from model.events.events_constants import EventStatus
from pydantic import BaseModel, Extra, Field
from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute


class Event(Entities, discriminator='Event'):
    # hk: Event
    # rk: v<version_number>#<entry_id>
    name = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)
    status = UnicodeAttribute(null=True)
    email = UnicodeAttribute(null=True)
    startDate = UnicodeAttribute(null=True)
    endDate = UnicodeAttribute(null=True)
    venue = UnicodeAttribute(null=True)
    bannerLink = UnicodeAttribute(null=True)
    logoLink = UnicodeAttribute(null=True)
    autoConfirm = BooleanAttribute(null=True)
    payedEvent = BooleanAttribute(null=True)
    price = NumberAttribute(null=True)
    certificateTemplate = UnicodeAttribute(null=True)


class EventIn(BaseModel):
    class Config:
        extra = Extra.forbid

    name: str = Field(None, title="Name")
    description: str = Field(None, title="Description")
    email: str = Field(None, title="Email")
    startDate: datetime = Field(None, title="Date")
    endDate: datetime = Field(None, title="Date")
    venue: str = Field(None, title="Venue")
    bannerLink: str = Field(None, title="Banner Link")
    logoLink: str = Field(None, title="Poster Link")
    autoConfirm: bool = Field(None, title="Auto Confirm")
    payedEvent: bool = Field(None, title="Payed Event")
    price: float = Field(None, title="Price")
    certificateTemplate: str = Field(None, title="Certificate Template")


class EventOut(EventIn):
    class Config:
        extra = Extra.ignore

    status: EventStatus = Field(..., title="Status")
    entryId: str = Field(..., title="ID")
    createDate: datetime = Field(..., title="Created At")
    updateDate: datetime = Field(..., title="Updated At")
    createdBy: str = Field(..., title="Created By")
    updatedBy: str = Field(..., title="Updated By")