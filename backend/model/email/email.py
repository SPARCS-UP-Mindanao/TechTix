from typing import List, Optional

from constants.common_constants import EmailType
from pydantic import BaseModel, EmailStr, Field


class EmailIn(BaseModel):
    to: Optional[List[EmailStr]] = Field(None, title='Email address of the recipient')
    cc: Optional[List[EmailStr]] = Field(None, title='CC Email addresses')
    bcc: Optional[List[EmailStr]] = Field(None, title='BCC Email address')
    subject: str = Field(..., title='Subject of the email')
    salutation: str = Field(..., title='Salutation of the email')
    body: List[str] = Field(..., title='Body of the email')
    regards: List[str] = Field(..., title='Regards of the email')
    emailType: EmailType = Field(..., title='Type of the email')
    eventId: str = Field(..., title='Event ID of the email')
    isSparcs: bool = Field(default=True, title='Is this a SPARCS sent email?')
