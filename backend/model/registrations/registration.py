import os
from datetime import datetime

from pydantic import BaseModel, EmailStr, Extra, Field
from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute
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
    email = UnicodeAttribute(null=True)

    emailLSI = EmailLSI()

    certificateClaimed = BooleanAttribute(null=True)
    firstName = UnicodeAttribute(null=True)
    lastName = UnicodeAttribute(null=True)
    contactNumber = UnicodeAttribute(null=True)
    careerStatus = UnicodeAttribute(null=True)
    yearsOfExperience = UnicodeAttribute(null=True)
    organization = UnicodeAttribute(null=True)
    title = UnicodeAttribute(null=True)
    gcashPayment = UnicodeAttribute(null=True)
    referenceNumber = UnicodeAttribute(null=True)
    discountCode = UnicodeAttribute(null=True)
    amountPaid = NumberAttribute(null=True)
    certificateImgObjectKey = UnicodeAttribute(null=True)
    certificatePdfObjectKey = UnicodeAttribute(null=True)
    registrationEmailSent = BooleanAttribute(default=False)
    confirmationEmailSent = BooleanAttribute(default=False)
    evaluationEmailSent = BooleanAttribute(default=False)
    certificateGenerated = BooleanAttribute(default=False)
    ticketTypeId = UnicodeAttribute(null=True)
    shirtSize = UnicodeAttribute(null=True)


class RegistrationDataIn(BaseModel):
    class Config:
        extra = Extra.ignore

    firstName: str = Field(None, title='First Name')
    lastName: str = Field(None, title='Last Name')
    contactNumber: str = Field(None, title='Contact Number')
    careerStatus: str = Field(None, title='Career Status')
    yearsOfExperience: str = Field(None, title='Years of Experience')
    organization: str = Field(None, title='Organization')
    title: str = Field(None, title='Title')
    eventId: str = Field(None, title='Event ID')
    ticketTypeId: str = Field(None, title='Ticket Type ID')
    shirtSize: str = Field(None, title='Shirt Size')


class PreRegistrationToRegistrationIn(RegistrationDataIn):
    class Config:
        extra = Extra.ignore

    email: str = Field(None, title='Email')


class RegistrationPatch(RegistrationDataIn):
    class Config:
        extra = Extra.ignore

    certificateClaimed: bool = Field(None, title='Certificate Claimed')


class RegistrationIn(RegistrationPatch):
    class Config:
        extra = Extra.forbid

    email: EmailStr = Field(None, title='Email')
    discountCode: str = Field(None, title='Discount Code')
    gcashPayment: str = Field(None, title='Gcash Payment')
    referenceNumber: str = Field(None, title='Reference Number')
    amountPaid: float = Field(None, title='Amount Paid')


class RegistrationOut(RegistrationIn):
    class Config:
        extra = Extra.ignore

    paymentId: str = Field(None, title='Payment ID')
    registrationId: str = Field(..., title='ID')
    createDate: datetime = Field(..., title='Created At')
    updateDate: datetime = Field(..., title='Updated At')
    gcashPaymentUrl: str = Field(None, title='Gcash Payment Address')
    certificateImgObjectKey: str = Field(None, title='Certificate Image Object Key')
    certificatePdfObjectKey: str = Field(None, title='Certificate PDF Object Key')
    certificateGenerated: bool = Field(None, title='Certificate Generated')


class RegistrationPreviewOut(BaseModel):
    class Config:
        extra = Extra.ignore

    firstName: str = Field(None, title='First Name')
    lastName: str = Field(None, title='Last Name')
    contactNumber: str = Field(None, title='Contact Number')
    email: EmailStr = Field(None, title='Email')
    registrationId: str = Field(..., title='ID')
