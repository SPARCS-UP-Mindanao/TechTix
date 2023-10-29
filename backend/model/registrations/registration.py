import os
from datetime import datetime

from model.registrations.registrations_constants import RegistrationStatus
from pydantic import BaseModel, Extra, Field
from pynamodb.attributes import BooleanAttribute, UnicodeAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex, LocalSecondaryIndex
from pynamodb.models import Model


class RegistrationGlobalSecondaryIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = 'RegistrationIdIndex'
        projection = AllProjection()
        read_capacity_units = 1
        write_capacity_units = 1

    registrationId = UnicodeAttribute(hash_key=True)


class EmailLSI(LocalSecondaryIndex):
    class Meta:
        index_name = 'EmailIndex'
        projection = AllProjection()
        read_capacity_units = 1
        write_capacity_units = 1
    
    hashKey = UnicodeAttribute(hash_key=True)
    email = UnicodeAttribute(range_key=True)


class Registration(Model):
    class Meta:
        table_name = os.getenv('REGISTRATIONS_TABLE')
        region = os.getenv('REGION')
        billing_mode = 'PAY_PER_REQUEST'

    hashKey = UnicodeAttribute(hash_key=True)
    rangeKey = UnicodeAttribute(range_key=True)
    registrationId = UnicodeAttribute(null=False)
    entryStatus = UnicodeAttribute(null=False)

    registrationIdGSI = RegistrationGlobalSecondaryIndex()

    createDate = UnicodeAttribute(null=False)
    updateDate = UnicodeAttribute(null=False)

    eventId = UnicodeAttribute(null=True)
    paymentId = UnicodeAttribute(null=True)
    status = UnicodeAttribute(null=True)
    email = UnicodeAttribute(null=True)

    emailLSI = EmailLSI()

    certificateClaimed = BooleanAttribute(null=True)
    evaluated = UnicodeAttribute(null=True)
    firstName = UnicodeAttribute(null=True)
    lastName = UnicodeAttribute(null=True)
    contactNumber = UnicodeAttribute(null=True)
    careerStatus = UnicodeAttribute(null=True)
    yearsOfExperience = UnicodeAttribute(null=True)
    organization = UnicodeAttribute(null=True)
    title = UnicodeAttribute(null=True)


class RegistrationPatch(BaseModel):
    class Config:
        extra = Extra.forbid

    email: str = Field(None, title="Email")
    firstName: str = Field(None, title="First Name")
    lastName: str = Field(None, title="Last Name")
    contactNumber: str = Field(None, title="Contact Number")
    careerStatus: str = Field(None, title="Career Status")
    yearsOfExperience: str = Field(None, title="Years of Experience")
    organization: str = Field(None, title="Organization")
    title: str = Field(None, title="Title")


class RegistrationIn(RegistrationPatch):
    class Config:
        extra = Extra.forbid

    eventId: str = Field(None, title="Event ID")


class RegistrationOut(RegistrationIn):
    class Config:
        extra = Extra.ignore

    paymentId: str = Field(None, title="Payment ID")
    certificateClaimed: bool = Field(None, title="Certificate Claimed")
    evaluated: str = Field(None, title="Evaluated")
    status: RegistrationStatus = Field(..., title="Status")
    registrationId: str = Field(..., title="ID")
    createDate: datetime = Field(..., title="Created At")
    updateDate: datetime = Field(..., title="Updated At")
