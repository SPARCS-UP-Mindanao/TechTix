import os
from datetime import datetime

from model.registrations.registrations_constants import RegistrationStatus
from pydantic import BaseModel, Extra, Field
from pynamodb.models import Model
from pynamodb.attributes import BooleanAttribute, UnicodeAttribute

"""
This code defines a Python module that includes two Pydantic models and a PynamoDB model for handling registration data.
It primarily focuses on defining the data structure for registration records and their attributes.

1. `Registration` Model:
    - `Registration` is a PynamoDB model representing a registration record. It is used to interact with the database table
      and store registration-related data.
    - The model includes attributes for various registration fields such as event ID, payment ID, certificate link, email,
      certificate sent status, user ID, personal information (first name, last name, contact number), career status, years of
      experience, organization, and title.
    - Additionally, it includes attributes for management purposes such as creation and update timestamps, creators, and
      status fields.
    - The `Meta` class specifies the table name, region, and billing mode for the PynamoDB table where registration data is stored.

2. `RegistrationIn` Model:
    - `RegistrationIn` is a Pydantic model used for incoming registration data when creating or updating registration records.
    - It enforces data validation for the input fields and includes attributes for event ID, payment ID, certificate link, email,
      certificate sent status, user ID, personal information (first name, last name, contact number), career status, years of
      experience, organization, and title.

3. `RegistrationOut` Model:
    - `RegistrationOut` is a Pydantic model that represents the outgoing data structure for registration records.
    - It inherits the attributes of `RegistrationIn` and adds attributes for status, entry ID, creation timestamp, update
      timestamp, creators, and updaters. It also enforces that extra fields are ignored.

This code provides a structured data model for registration records, ensuring data consistency and validation when handling
incoming and outgoing registration data. It also defines the PynamoDB model for interaction with the database table.
"""
class Registration(Model):
    class Meta: 
        table_name = os.getenv('REGISTRATIONS_TABLE')
        region = os.getenv('REGION')
        billing_mode = 'PAY_PER_REQUEST'
    
    hashKey = UnicodeAttribute(hash_key=True)
    rangeKey = UnicodeAttribute(range_key=True)
    entryId = UnicodeAttribute(null=False)
    entryStatus = UnicodeAttribute(null=False)

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
    entryId: str = Field(..., title="ID")
    createDate: datetime = Field(..., title="Created At")
    updateDate: datetime = Field(..., title="Updated At")
    createdBy: str = Field(..., title="Created By")
    updatedBy: str = Field(..., title="Updated By")
