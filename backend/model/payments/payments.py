from enum import Enum
from typing import Optional

from model.entities import Entities
from model.pycon_registrations.pycon_registration import (
    PyconRegistration,
    PyconRegistrationOut,
)
from pydantic import BaseModel, Field
from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute


class TransactionStatus(str, Enum):
    PENDING = 'PENDING'
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'


class PaymentTransaction(Entities, discriminator='PaymentTransaction'):
    # hk: PaymentTransaction#<eventId>
    # rk: v<version_number>#<entry_id>

    price = NumberAttribute(null=False)
    eventId = UnicodeAttribute(null=False)
    transactionStatus = UnicodeAttribute(null=False)

    # registration data - core info
    firstName = UnicodeAttribute(null=True)
    lastName = UnicodeAttribute(null=True)
    nickname = UnicodeAttribute(null=True)
    pronouns = UnicodeAttribute(null=True)
    email = UnicodeAttribute(null=True)
    contactNumber = UnicodeAttribute(null=True)
    organization = UnicodeAttribute(null=True)
    jobTitle = UnicodeAttribute(null=True)

    # social media (will be stored as JSON string)
    facebookLink = UnicodeAttribute(null=True)
    linkedInLink = UnicodeAttribute(null=True)

    # ticket and event preferences
    ticketType = UnicodeAttribute(null=True)
    sprintDay = BooleanAttribute(null=True)

    # t-shirt preferences
    availTShirt = BooleanAttribute(null=True)
    shirtType = UnicodeAttribute(null=True)
    shirtSize = UnicodeAttribute(null=True)

    # community and preferences
    communityInvolvement = BooleanAttribute(null=True)
    futureVolunteer = BooleanAttribute(null=True)
    dietaryRestrictions = UnicodeAttribute(null=True)
    accessibilityNeeds = UnicodeAttribute(null=True)

    # discount and files
    discountCode = UnicodeAttribute(null=True)
    validIdObjectKey = UnicodeAttribute(null=True)

    # payment specific
    paymentRequestId = UnicodeAttribute(null=True)


class PaymentTransactionIn(BaseModel):
    class Config:
        extra = 'forbid'

    price: float = Field(None, title='Price')
    transactionStatus: TransactionStatus = Field(None, title='Transaction Status')
    eventId: Optional[str] = Field(None, title='Event ID')
    paymentRequestId: Optional[str] = Field(None, title='Payment Request ID')
    registrationData: Optional[PyconRegistration] = Field(None, title='Registration Data')


class PaymentTransactionOut(PaymentTransactionIn):
    class Config:
        extra = 'ignore'

    entryId: str = Field(..., title='Entry ID')
    registrationData: Optional[PyconRegistrationOut] = Field(None, title='Registration Data')

    amountPaid: Optional[float] = Field(None, title='Amount Paid')
    transactionId: Optional[str] = Field(None, title='Transaction ID')
    paymentId: Optional[str] = Field(None, title='Payment ID')
    referenceNumber: Optional[str] = Field(None, title='Reference Number')
    gcashPayment: Optional[dict] = Field(None, title='GCash Payment Details')


class PaymentTrackingBody(BaseModel):
    class Config:
        extra = 'ignore'

    registration_details: PaymentTransactionOut
    status: TransactionStatus
