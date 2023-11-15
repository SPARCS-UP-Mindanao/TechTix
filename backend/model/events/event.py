from datetime import datetime
from typing import Optional

from model.entities import Entities
from model.events.events_constants import EventStatus
from pydantic import BaseModel, EmailStr, Extra, Field
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
    email: EmailStr = Field(None, title="Email")
    startDate: datetime = Field(None, title="Date")
    endDate: datetime = Field(None, title="Date")
    venue: str = Field(None, title="Venue")
    autoConfirm: bool = Field(None, title="Auto Confirm")
    payedEvent: bool = Field(None, title="Payed Event")
    price: float = Field(None, title="Price")
    bannerLink: str = Field(None, title="Banner Link")
    logoLink: str = Field(None, title="Poster Link")
    certificateTemplate: str = Field(None, title="Certificate Template")
    status: Optional[EventStatus] = Field(None, title="Event Status")


class EventOut(EventIn):
    class Config:
        extra = Extra.ignore

    entryId: str = Field(..., title="ID")
    createDate: datetime = Field(..., title="Created At")
    updateDate: datetime = Field(..., title="Updated At")
    createdBy: str = Field(..., title="Created By")
    updatedBy: str = Field(..., title="Updated By")
    bannerUrl: Optional[str] = Field(None, title="Banner Pre-signed URL")
    logoUrl: Optional[str] = Field(None, title="Logo Pre-signed URL")
    certificateTemplateUrl: Optional[str] = Field(None, title="Certificate Template Pre-signed URL")
