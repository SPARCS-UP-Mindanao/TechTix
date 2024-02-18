from datetime import datetime
from typing import List

from model.entities import Entities
from pydantic import BaseModel, Extra, Field
from pynamodb.attributes import ListAttribute


class FAQs(Entities, discriminator='FAQs'):
    # hk: FAQs
    # rk: v<version_number>#<entry_id>
    faqs = ListAttribute(null=True)

class FAQIn(BaseModel):
    class Config:
        extra = Extra.forbid
    
    question: str = Field(..., title='Question')
    answer: str = Field(..., title='Answer')    


class FAQsIn(BaseModel):
    class Config:
        extra = Extra.forbid

    faqs: List[FAQIn] = Field(..., title='FAQs')


class FAQsOut(FAQsIn):
    class Config:
        extra = Extra.ignore

    entryId: str = Field(..., title='ID')
    createDate: datetime = Field(..., title='Created At')
    updateDate: datetime = Field(..., title='Updated At')
