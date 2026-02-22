import os
from datetime import datetime
from typing import Optional

from model.preregistrations.preregistrations_constants import AcceptanceStatus
from pydantic import BaseModel, EmailStr, Extra, Field
from pynamodb.attributes import BooleanAttribute, UnicodeAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex, LocalSecondaryIndex
from pynamodb.models import Model


class PreRegistrationGlobalSecondaryIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = 'PreRegistrationIdIndex'
        projection = AllProjection()
        read_capacity_units = 1
        write_capacity_units = 1

    preRegistrationId = UnicodeAttribute(hash_key=True)


class EmailLSI(LocalSecondaryIndex):
    class Meta:
        index_name = 'EmailIndex'
        projection = AllProjection()
        read_capacity_units = 1
        write_capacity_units = 1

    hashKey = UnicodeAttribute(hash_key=True)
    email = UnicodeAttribute(range_key=True)


class PreRegistration(Model):
    class Meta:
        table_name = os.getenv('PREREGISTRATIONS_TABLE')
        region = os.getenv('REGION')
        billing_mode = 'PAY_PER_REQUEST'

    hashKey = UnicodeAttribute(hash_key=True)
    rangeKey = UnicodeAttribute(range_key=True)
    preRegistrationId = UnicodeAttribute(null=False)
    entryStatus = UnicodeAttribute(null=False)

    preRegistrationIdGSI = PreRegistrationGlobalSecondaryIndex()

    createDate = UnicodeAttribute(null=False)
    updateDate = UnicodeAttribute(null=False)

    eventId = UnicodeAttribute(null=True)
    email = UnicodeAttribute(null=True)

    emailLSI = EmailLSI()

    firstName = UnicodeAttribute(null=True)
    lastName = UnicodeAttribute(null=True)
    contactNumber = UnicodeAttribute(null=True)
    careerStatus = UnicodeAttribute(null=True)
    yearsOfExperience = UnicodeAttribute(null=True)
    organization = UnicodeAttribute(null=True)
    title = UnicodeAttribute(null=True)
    preRegistrationEmailSent = BooleanAttribute(default=False)
    acceptanceEmailSent = BooleanAttribute(default=False)
    acceptanceStatus = UnicodeAttribute(null=True)


class PreRegistrationaDataIn(BaseModel):
    class Config:
        extra = Extra.ignore

    firstName: str = Field(None, title='First Name')
    lastName: str = Field(None, title='Last Name')
    contactNumber: str = Field(None, title='Contact Number')
    careerStatus: str = Field(None, title='Career Status')
    yearsOfExperience: str = Field(None, title='Years of Experience')
    organization: str = Field(None, title='Organization')
    title: str = Field(None, title='Title')


class PreRegistrationPatch(PreRegistrationaDataIn):
    class Config:
        extra = Extra.ignore

    acceptanceStatus: Optional[AcceptanceStatus] = Field(None, title='Acceptance Status')
    acceptanceEmailSent: bool = Field(None, title='Acceptance Email Sent')


class PreRegistrationIn(PreRegistrationaDataIn):
    class Config:
        extra = Extra.forbid

    email: EmailStr = Field(None, title='Email')
    eventId: str = Field(None, title='Event ID')


class PreRegistrationOut(PreRegistrationIn):
    class Config:
        extra = Extra.ignore

    preRegistrationId: str = Field(..., title='ID')
    acceptanceEmailSent: bool = Field(None, title='Acceptance Email Sent')
    acceptanceStatus: Optional[AcceptanceStatus] = Field(None, title='Acceptance Status')
    createDate: datetime = Field(..., title='Created At')
    updateDate: datetime = Field(..., title='Updated At')


class PreRegistrationPreviewOut(BaseModel):
    class Config:
        extra = Extra.ignore

    firstName: str = Field(None, title='First Name')
    lastName: str = Field(None, title='Last Name')
    contactNumber: str = Field(None, title='Contact Number')
    email: EmailStr = Field(None, title='Email')
