import os
from datetime import datetime

from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from model.registrations.registrations_constants import RegistrationStatus
from pydantic import BaseModel, Extra, Field
from pynamodb.models import Model
from pynamodb.attributes import BooleanAttribute, UnicodeAttribute

class RegistrationGlobalSecondaryIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = 'RegistrationIdIndex'
        projection = AllProjection()
        read_capacity_units = 1
        write_capacity_units = 1

    registrationId = UnicodeAttribute(hash_key=True)

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
    createdBy = UnicodeAttribute(null=False)
    updatedBy = UnicodeAttribute(null=False)

    eventId = UnicodeAttribute(null=True)
    paymentId = UnicodeAttribute(null=True)
    status = UnicodeAttribute(null=True)
    certificateLink = UnicodeAttribute(null=True)
    email = UnicodeAttribute(null=True)
    certificateSent = BooleanAttribute(null=True)
    evaluated = UnicodeAttribute(null=True)
    userId = UnicodeAttribute(null=True)
    firstName = UnicodeAttribute(null=True)
    lastName = UnicodeAttribute(null=True)
    contactNumber = UnicodeAttribute(null=True)
    careerStatus = UnicodeAttribute(null=True)
    yearsOfExperience = UnicodeAttribute(null=True)
    organization = UnicodeAttribute(null=True)
    title = UnicodeAttribute(null=True)

class RegistrationIn(BaseModel):
    class Config:
        extra = Extra.forbid

    eventId: str = Field(None, title="Event ID")
    paymentId: str = Field(None, title="Payment ID")
    certificateLink: str = Field(None, title="Certificate Link")
    email: str = Field(None, title="Email")
    certificateSent: bool = Field(None, title="Certificate Sent")
    evaluated: str = Field(None, title="Evaluated")
    userId: str = Field(None, title="User ID")
    firstName: str = Field(None, title="First Name")
    lastName: str = Field(None, title="Last Name")
    contactNumber: str = Field(None, title="Contact Number")
    careerStatus: str = Field(None, title="Career Status")
    yearsOfExperience: str = Field(None, title="Years of Experience")
    organization: str = Field(None, title="Organization")
    title: str = Field(None, title="Title")

class RegistrationOut(RegistrationIn):
    class Config:
        extra = Extra.ignore

    status: RegistrationStatus = Field(..., title="Status")
    registrationId: str = Field(..., title="ID")
    createDate: datetime = Field(..., title="Created At")
    updateDate: datetime = Field(..., title="Updated At")
    createdBy: str = Field(..., title="Created By")
    updatedBy: str = Field(..., title="Updated By")
