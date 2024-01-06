from pydantic import BaseModel, EmailStr, Field


class CertificateIn(BaseModel):
    email: EmailStr = Field(None, title='Email')


class CertificateOut(BaseModel):
    isFirstClaim: bool = Field(None, title='Already Claimed Flag')
    certificateTemplate: str = Field(None, title='Certificate Template')
    certificatePDFTemplate: str = Field(None, title='Certificate PDF Template')
    certificateTemplateKey: str = Field(None, title='Certificate Template Object Key')
    certificatePDFTemplateKey: str = Field(None, title='Certificate PDF Template Object Key')
    registrationId: str = Field(None, title='Registration Id')
