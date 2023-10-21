import os
from datetime import datetime

from model.evaluations.evaluations_constants import EvaluationStatus
from pydantic import BaseModel, Extra, Field
from pynamodb.models import Model
from pynamodb.indexes import LocalSecondaryIndex
from pynamodb.attributes import NumberAttribute, UnicodeAttribute


class Evaluation(Model):
    class Meta:
        table_name = os.getenv('EVALUATIONS_TABLE')
        region = os.getenv('REGION')
        billing_mode = 'PAY_PER_REQUEST'

    # hk : <eventId>
    # rk : <registrationId>#<question>
    hashKey = UnicodeAttribute(hash_key=True)
    rangeKey = UnicodeAttribute(range_key=True)
    entryId = UnicodeAttribute(null=True)
    status = UnicodeAttribute(null=True)

    createdDate = UnicodeAttribute(null=True)
    updatedDate = UnicodeAttribute(null=True)
    createdBy = UnicodeAttribute(null=True)
    updatedBy = UnicodeAttribute(null=True)

    eventId = UnicodeAttribute(null=True)
    registrationId = UnicodeAttribute(null=True)
    answer = UnicodeAttribute(null=True)
    answerScale = NumberAttribute(null=True)

    question_lsi = LocalSecondaryIndex(
        read_capacity_units=1,
        write_capacity_units=1
    )
    question = UnicodeAttribute(local_secondary_index=question_lsi)

class EvaluationIn(BaseModel):
    class Config: 
        extra = Extra.forbid
    
    eventId: str = Field(None, title="Event ID")
    registrationId: str = Field(None, title="Registration ID")
    question: str = Field(None, title="Question")
    answer: str = Field(None, title="Answer")
    answerScale: int = Field(None, title="Answer Scale")


class EvaluationOut(EvaluationIn):
    class Config:
        extra = Extra.ignore
    
    status: EvaluationStatus = Field(..., title="Status")
    entryId: str = Field(..., title="ID")
    createDate: datetime = Field(..., title="Created At")
    updateDate: datetime = Field(..., title="Updated At")
    createdBy: str = Field(..., title="Created By")
    updatedBy: str = Field(..., title="Updated By")
