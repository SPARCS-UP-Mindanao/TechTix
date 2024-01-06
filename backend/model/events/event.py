import os
from datetime import datetime
from typing import Optional

from model.events.events_constants import EventStatus
from pydantic import BaseModel, EmailStr, Extra, Field
from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute
from pynamodb.indexes import AllProjection, LocalSecondaryIndex
from pynamodb.models import Model


class EventIdIndex(LocalSecondaryIndex):
    class Meta:
        index_name = 'eventId-index'
        projection = AllProjection()
        read_capacity_units = 1
        write_capacity_units = 1

    hashKey = UnicodeAttribute(hash_key=True)
    eventId = UnicodeAttribute(range_key=True)


class Event(Model):
    # hk: v<version_number>
    # rk: <adminId>#<eventId>
    class Meta:
        table_name = os.getenv('EVENTS_TABLE')
        region = os.getenv('REGION')
        billing_mode = 'PAY_PER_REQUEST'

    hashKey = UnicodeAttribute(hash_key=True)
    rangeKey = UnicodeAttribute(range_key=True)

    latestVersion = NumberAttribute(null=False)
    entryStatus = UnicodeAttribute(null=False)
    eventId = UnicodeAttribute(null=False)

    createDate = UnicodeAttribute(null=True)
    updateDate = UnicodeAttribute(null=True)
    createdBy = UnicodeAttribute(null=True)
    updatedBy = UnicodeAttribute(null=True)

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

    gcashQRCode = UnicodeAttribute(null=True)
    gcashName = UnicodeAttribute(null=True)
    gcashNumber = UnicodeAttribute(null=True)

    eventIdIndex = EventIdIndex()


class EventIn(BaseModel):
    class Config:
        extra = Extra.forbid

    name: str = Field(None, title='Name')
    description: str = Field(None, title='Description')
    email: EmailStr = Field(None, title='Email')
    startDate: datetime = Field(None, title='Date')
    endDate: datetime = Field(None, title='Date')
    venue: str = Field(None, title='Venue')
    autoConfirm: bool = Field(None, title='Auto Confirm')
    payedEvent: bool = Field(None, title='Payed Event')
    price: float = Field(None, title='Price')
    bannerLink: str = Field(None, title='Banner Link')
    logoLink: str = Field(None, title='Poster Link')
    certificateTemplate: str = Field(None, title='Certificate Template')

    gcashQRCode: str = Field(None, title='GCash QR Code')
    gcashName: str = Field(None, title='Gcash Name')
    gcashNumber: str = Field(None, title='Gcash Number')

    status: Optional[EventStatus] = Field(None, title='Event Status')


class EventOut(EventIn):
    class Config:
        extra = Extra.ignore

    eventId: str = Field(..., title='ID')
    createDate: datetime = Field(..., title='Created At')
    updateDate: datetime = Field(..., title='Updated At')
    createdBy: str = Field(..., title='Created By')
    updatedBy: str = Field(None, title='Updated By')
    bannerUrl: Optional[str] = Field(None, title='Banner Pre-signed URL')
    logoUrl: Optional[str] = Field(None, title='Logo Pre-signed URL')
    certificateTemplateUrl: Optional[str] = Field(None, title='Certificate Template Pre-signed URL')
