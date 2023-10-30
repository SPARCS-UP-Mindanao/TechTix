import os
from datetime import datetime
from typing import List

from model.evaluations.evaluations_constants import EvaluationQuestionType, QuestionType
from pydantic import BaseModel, Extra, Field
from pynamodb.attributes import (
    BooleanAttribute,
    ListAttribute,
    NumberAttribute,
    UnicodeAttribute,
)
from pynamodb.indexes import AllProjection, LocalSecondaryIndex
from pynamodb.models import Model

"""
    hash key = eventId
    range key = registration + question
"""


class QuestionLSI(LocalSecondaryIndex):
    class Meta:
        index_name = 'QuestionLSI'
        projection = AllProjection()
        read_capacity_units = 1
        write_capacity_units = 1

    eventId = UnicodeAttribute(hash_key=True)
    question = UnicodeAttribute(range_key=True)


class Evaluation(Model):
    class Meta:
        table_name = os.getenv('EVALUATIONS_TABLE')
        region = os.getenv('REGION')
        billing_mode = 'PAY_PER_REQUEST'

    # hk : <eventId>
    # rk : <registrationId>#<question>
    hashKey = UnicodeAttribute(hash_key=True)
    rangeKey = UnicodeAttribute(range_key=True)
    questionLSI = QuestionLSI()

    eventId = UnicodeAttribute(null=False)
    registrationId = UnicodeAttribute(null=False)
    question = UnicodeAttribute(null=False)
    questionType = UnicodeAttribute(null=False)
    answer = UnicodeAttribute(null=True)
    answerScale = NumberAttribute(null=True)
    multipleAnswers = ListAttribute(null=True)
    booleanAnswer = BooleanAttribute(null=True)

    createDate = UnicodeAttribute(null=False)
    updateDate = UnicodeAttribute(null=False)


class EvaluationPatch(BaseModel):
    class Config:
        extra = Extra.forbid

    answer: str = Field(None, title="Answer")
    answerScale: int = Field(None, title="Answer Scale")
    multipleAnswers: List[str] = Field(None, title="Multiple Answers")
    booleanAnswer: bool = Field(None, title="Boolean Answer")
    questionType: QuestionType = Field(None, title="Question Type")


class EvaluationIn(EvaluationPatch):
    class Config:
        extra = Extra.forbid

    question: EvaluationQuestionType = Field(None, title="Question")


class EvaluationListIn(BaseModel):
    class Config:
        extra = Extra.forbid

    evaluationList: List[EvaluationIn] = Field(None, title="List of Evaluations")
    eventId: str = Field(None, title="Event ID")
    registrationId: str = Field(None, title="Registration ID")


class EvaluationOut(EvaluationIn):
    class Config:
        extra = Extra.ignore

    eventId: str = Field(None, title="Event ID")
    registrationId: str = Field(None, title="Registration ID")
    createDate: datetime = Field(..., title="Created At")
    updateDate: datetime = Field(..., title="Updated At")
