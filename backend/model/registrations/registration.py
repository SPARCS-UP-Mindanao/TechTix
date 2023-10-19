import os
from datetime import datetime

from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from model.registrations.registrations_constants import RegistrationStatus
from pydantic import BaseModel, Extra, Field
from pynamodb.models import Model
from pynamodb.attributes import BooleanAttribute, UnicodeAttribute

class RegistrationGlobalSecondaryIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = 'registrationId-index'
        projection = AllProjection()

    registrationId = UnicodeAttribute(hash_key=True)

class Registration(Model):
    """
    Represents a registration entry in the database.

    This class defines the structure of a registration record and maps it to the DynamoDB table.

    Attributes:
        table_name (str): The name of the DynamoDB table for registrations.
        region (str): The AWS region where the table is located.
        billing_mode (str): The billing mode for the table (e.g., 'PAY_PER_REQUEST').

        hashKey (UnicodeAttribute): The hash key attribute for registration records.
        rangeKey (UnicodeAttribute): The range key attribute for registration records.
        registrationId (UnicodeAttribute): The unique registration identifier.
        entryStatus (UnicodeAttribute): The status of the registration entry.

        createDate (UnicodeAttribute): The date when the registration was created.
        updateDate (UnicodeAttribute): The date when the registration was last updated.
        createdBy (UnicodeAttribute): The user who created the registration.
        updatedBy (UnicodeAttribute): The user who last updated the registration.

        eventId (UnicodeAttribute): The associated event ID.
        paymentId (UnicodeAttribute): The payment ID for the registration.
        status (UnicodeAttribute): The status of the registration.
        certificateLink (UnicodeAttribute): The link to the certificate.
        email (UnicodeAttribute): The email associated with the registration.
        certificateSent (BooleanAttribute): Indicates if the certificate was sent.
        evaluated (UnicodeAttribute): The evaluation status.
        userId (UnicodeAttribute): The user's ID.
        firstName (UnicodeAttribute): The first name of the user.
        lastName (UnicodeAttribute): The last name of the user.
        contactNumber (UnicodeAttribute): The contact number of the user.
        careerStatus (UnicodeAttribute): The career status of the user.
        yearsOfExperience (UnicodeAttribute): The years of experience of the user.
        organization (UnicodeAttribute): The organization of the user.
        title (UnicodeAttribute): The title of the user.
    """
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
    """
    Represents the input model for creating or updating a registration.

    This Pydantic model defines the structure of the data required to create or update a registration entry.

    Attributes:
        eventId (str): The associated event ID.
        paymentId (str): The payment ID for the registration.
        certificateLink (str): The link to the certificate.
        email (str): The email associated with the registration.
        certificateSent (bool): Indicates if the certificate was sent.
        evaluated (str): The evaluation status.
        userId (str): The user's ID.
        firstName (str): The first name of the user.
        lastName (str): The last name of the user.
        contactNumber (str): The contact number of the user.
        careerStatus (str): The career status of the user.
        yearsOfExperience (str): The years of experience of the user.
        organization (str): The organization of the user.
        title (str): The title of the user.
    """
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
    """
    Represents the output model for a registration entry.

    This Pydantic model extends the RegistrationIn model with additional attributes.

    Attributes:
        status (RegistrationStatus): The status of the registration.
        registrationId (str): The unique identifier for a registration entry.
        createDate (datetime): The date when the registration was created.
        updateDate (datetime): The date when the registration was last updated.
        createdBy (str): The user who created the registration.
        updatedBy (str): The user who last updated the registration.
    """
    class Config:
        extra = Extra.ignore

    status: RegistrationStatus = Field(..., title="Status")
    registrationId: str = Field(..., title="ID")
    createDate: datetime = Field(..., title="Created At")
    updateDate: datetime = Field(..., title="Updated At")
    createdBy: str = Field(..., title="Created By")
    updatedBy: str = Field(..., title="Updated By")
