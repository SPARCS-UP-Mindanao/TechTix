from enum import Enum
from typing import Dict, List, Optional

from model.entities import Entities
from pydantic import BaseModel, Field
from pynamodb.attributes import NumberAttribute, UnicodeAttribute


class TransactionStatus(Enum):
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
    price: float = Field(..., title='Price')
    eventId: str = Field(..., title='Event ID')
    transactionStatus: TransactionStatus = Field(..., title='Transaction Status')

class PaymentTransactionOut(PaymentTransactionIn):
    entryId: str = Field(..., title='Entry ID')
