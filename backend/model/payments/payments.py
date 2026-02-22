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


class PaymentTransactionIn(BaseModel):
    price: float = Field(None, title='Price')
    transactionStatus: TransactionStatus = Field(None, title='Transaction Status')
    eventId: Optional[str] = Field(None, title='Event ID')


class PaymentTransactionOut(PaymentTransactionIn):
    entryId: str = Field(..., title='Entry ID')
