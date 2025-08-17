from enum import Enum
from typing import Optional

from model.entities import Entities
from pydantic import BaseModel, Field
from pynamodb.attributes import NumberAttribute, UnicodeAttribute


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

    # registration data
    firstName: str = Field(None, title='First Name')
    lastName: str = Field(None, title='Last Name')
    contactNumber: str = Field(None, title='Contact Number')
    careerStatus: str = Field(None, title='Career Status')
    yearsOfExperience: str = Field(None, title='Years of Experience')
    organization: str = Field(None, title='Organization')
    title: str = Field(None, title='Title')
    paymentRequestId: str = Field(None, title='Payment Request ID')


class PaymentTransactionIn(BaseModel):
    class Config:
        extra = 'forbid'

    price: float = Field(None, title='Price')
    transactionStatus: TransactionStatus = Field(None, title='Transaction Status')
    eventId: Optional[str] = Field(None, title='Event ID')
    paymentRequestId: Optional[str] = Field(None, title='Payment Request ID')

    # Registration Data
    firstName: Optional[str] = Field(None, title='First Name')
    lastName: Optional[str] = Field(None, title='Last Name')
    contactNumber: Optional[str] = Field(None, title='Contact Number')
    careerStatus: Optional[str] = Field(None, title='Career Status')
    yearsOfExperience: Optional[str] = Field(None, title='Years of Experience')
    organization: Optional[str] = Field(None, title='Organization')
    title: Optional[str] = Field(None, title='Title')


class PaymentTransactionOut(PaymentTransactionIn):
    class Config:
        extra = 'ignore'

    entryId: str = Field(..., title='Entry ID')
