from pydantic import BaseModel, EmailStr, Field


class CertificateIn(BaseModel):
    email: EmailStr = Field(None, title="Email")


class CertificateOut(BaseModel):
    certificateTemplate: str = Field(None, title="Certificate Template")
