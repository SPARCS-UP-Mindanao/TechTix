import os
from datetime import datetime
from typing import List, Optional

from model.events.events_constants import EventStatus
from model.ticket_types.ticket_types import TicketTypeIn, TicketTypeOut
from pydantic import BaseModel, EmailStr, Extra, Field, root_validator
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
    paidEvent = BooleanAttribute(null=True)
    price = NumberAttribute(null=True)
    certificateTemplate = UnicodeAttribute(null=True)
    isApprovalFlow = BooleanAttribute(null=True)

    gcashQRCode = UnicodeAttribute(null=True)
    gcashName = UnicodeAttribute(null=True)
    gcashNumber = UnicodeAttribute(null=True)

    isLimitedSlot = BooleanAttribute(default=False)
    registrationCount = NumberAttribute(default=0)
    maximumSlots = NumberAttribute(null=True)

    dailyEmailCount = NumberAttribute(default=0)
    lastEmailSent = UnicodeAttribute(null=True)

    hasMultipleTicketTypes = BooleanAttribute(default=False)
    konfhubId = UnicodeAttribute(null=True)
    konfhubApiKey = UnicodeAttribute(null=True)

    platformFee = NumberAttribute(null=True)

    eventIdIndex = EventIdIndex()

    # PyCon Sprint Fields
    sprintDay = BooleanAttribute(null=True)
    sprintDayPrice = NumberAttribute(null=True)
    maximumSprintDaySlots = NumberAttribute(null=True)
    sprintDayRegistrationCount = NumberAttribute(default=0)


class EventDBIn(BaseModel):
    class Config:
        extra = Extra.ignore

    name: str = Field(None, title='Name')
    description: str = Field(None, title='Description')
    email: EmailStr = Field(None, title='Email')
    startDate: datetime = Field(None, title='Date')
    endDate: datetime = Field(None, title='Date')
    venue: str = Field(None, title='Venue')
    paidEvent: bool = Field(None, title='Paid Event')
    price: float = Field(None, title='Price')
    bannerLink: str = Field(None, title='Banner Link')
    logoLink: str = Field(None, title='Poster Link')
    certificateTemplate: str = Field(None, title='Certificate Template')
    isApprovalFlow: bool = Field(None, title='Approval Flow')

    isLimitedSlot: bool = Field(None, title='Is Limited Slot')
    maximumSlots: int = Field(None, title='Maximum Slots')

    status: Optional[EventStatus] = Field(None, title='Event Status')
    hasMultipleTicketTypes: Optional[bool] = Field(None, title='Has Multiple Ticket Types')
    konfhubId: Optional[str] = Field(None, title='Konfhub ID')
    konfhubApiKey: Optional[str] = Field(None, title='Konfhub API Key')

    platformFee: Optional[float] = Field(None, title='Percent platform fee')

    # PyCon Sprint Fields
    sprintDay: Optional[bool] = Field(
        None, title='Sprint Day', description='Indicates if the event includes a sprint day'
    )
    sprintDayPrice: Optional[float] = Field(
        None, title='Sprint Day Price', description='The price for the sprint day ticket'
    )
    maximumSprintDaySlots: Optional[int] = Field(
        None, title='Sprint Day Maximum Slots', description='The maximum number of slots for the sprint day'
    )
    sprintDayRegistrationCount: Optional[int] = Field(
        None,
        title='Sprint Day Registration Count',
        description='The current number of registrations for the sprint day',
    )

    @root_validator(pre='false')
    def check_sprint_day(cls, values):
        sprint_day = values.get('sprintDay')
        sprint_day_price = values.get('sprintDayPrice')

        if sprint_day and sprint_day_price is None:
            raise ValueError('sprintDayPrice must be set if sprintDay is true')

        return values


class EventIn(EventDBIn):
    class Config:
        extra = Extra.forbid

    ticketTypes: Optional[List[TicketTypeIn]] = Field(None, title='Ticket Types')


class EventDataIn(EventIn):
    class Config:
        extra = Extra.forbid

    gcashQRCode: str = Field(None, title='GCash QR Code')
    gcashName: str = Field(None, title='Gcash Name')
    gcashNumber: str = Field(None, title='Gcash Number')

    registrationCount: int = Field(None, title='Registration Count')

    dailyEmailCount: int = Field(None, title='Daily Email Count')
    lastEmailSent: datetime = Field(None, title='Last Email Sent')


class EventAdminOut(EventDataIn):
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
    ticketTypes: Optional[List[TicketTypeOut]] = Field(None, title='Ticket Types')


class EventOut(EventAdminOut):
    class Config:
        extra = Extra.ignore

    konfhubId: Optional[str] = Field(None, title='Konfhub ID', exclude=True)
    konfhubApiKey: Optional[str] = Field(None, title='Konfhub API Key', exclude=True)
