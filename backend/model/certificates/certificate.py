from pydantic import BaseModel, Field

class CertificateIn(BaseModel):
    email: str = Field(None, title="Email")

class CertificateOut(BaseModel):
    certificateTemplate: str = Field(None, title="Certificate Template")