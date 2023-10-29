from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class EmailIn(BaseModel):
    to: EmailStr = Field(..., title="Email address of the recipient")
    cc: Optional[List[EmailStr]] = Field(None, title="CC Email addresses")
    bcc: Optional[List[EmailStr]] = Field(None, title="BCC Email address")
    subject: str = Field(..., title="Subject of the email")
    salutation: str = Field(...,title="Salutation of the email")
    content: str = Field(...,title="Content of the email")
    body: List[str] = Field(...,title="Body of the email")
    regards: List[str]= Field(..., title="Regards of the email")
