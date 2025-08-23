import os
from datetime import datetime
from typing import Optional

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
    transactionId = UnicodeAttribute(null=True)

    # AWS Community Day Specific Fields
    shirtSize = UnicodeAttribute(null=True)
    cityOfResidence = UnicodeAttribute(null=True)
    industry = UnicodeAttribute(null=True)
    levelOfAWSUsage = UnicodeAttribute(null=True)
    awsUsecase = UnicodeAttribute(null=True)
    awsCommunityDayInLineWith = UnicodeAttribute(null=True)
    foodRestrictions = UnicodeAttribute(null=True)

    # PyCon Specific Fields
    nickname = UnicodeAttribute(null=True)
    pronouns = UnicodeAttribute(null=True)
    jobTitle = UnicodeAttribute(null=True)
    facebookLink = UnicodeAttribute(null=True)
    linkedInLink = UnicodeAttribute(null=True)
    ticketType = UnicodeAttribute(null=True)
    sprintDay = BooleanAttribute(null=True)
    availTShirt = BooleanAttribute(null=True)
    shirtType = UnicodeAttribute(null=True)
    communityInvolvement = BooleanAttribute(null=True)
    futureVolunteer = BooleanAttribute(null=True)
    dietaryRestrictions = UnicodeAttribute(null=True)
    accessibilityNeeds = UnicodeAttribute(null=True)
    validIdObjectKey = UnicodeAttribute(null=True)


class RegistrationDataIn(BaseModel):
    class Config:
        extra = Extra.ignore

    firstName: Optional[str] = Field(None, title='First Name')
    lastName: Optional[str] = Field(None, title='Last Name')
    contactNumber: Optional[str] = Field(None, title='Contact Number')
    careerStatus: Optional[str] = Field(None, title='Career Status')
    yearsOfExperience: Optional[str] = Field(None, title='Years of Experience')
    organization: Optional[str] = Field(None, title='Organization')
    title: Optional[str] = Field(None, title='Title')
    eventId: Optional[str] = Field(None, title='Event ID')
    ticketTypeId: Optional[str] = Field(None, title='Ticket Type ID')
    shirtSize: Optional[str] = Field(None, title='Shirt Size')

    # AWS Community Day Specific Fields
    cityOfResidence: Optional[str] = Field(None, title='City of Residence')
    industry: Optional[str] = Field(None, title='Industry')
    levelOfAWSUsage: Optional[str] = Field(None, title='Level of AWS Usage')
    awsUsecase: Optional[str] = Field(None, title='AWS Use Case')
    awsCommunityDayInLineWith: Optional[str] = Field(None, title='AWS Community Day In Line With')
    foodRestrictions: Optional[str] = Field(None, title='Food Restrictions')


class PreRegistrationToRegistrationIn(RegistrationDataIn):
    class Config:
        extra = Extra.ignore

    email: str = Field(None, title='Email')


class RegistrationPatch(RegistrationDataIn):
    class Config:
        extra = Extra.ignore

    certificateClaimed: Optional[bool] = Field(None, title='Certificate Claimed')


class RegistrationIn(RegistrationPatch):
    class Config:
        extra = Extra.forbid

    email: Optional[EmailStr] = Field(None, title='Email')
    discountCode: Optional[str] = Field(None, title='Discount Code')
    gcashPayment: Optional[str] = Field(None, title='Gcash Payment')
    referenceNumber: Optional[str] = Field(None, title='Reference Number')
    amountPaid: Optional[float] = Field(None, title='Amount Paid')
    transactionId: Optional[str] = Field(None, title='Transaction ID')


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
