from typing import Dict, List

from pydantic import BaseModel, EmailStr, Field


class RegistrationDetail(BaseModel):
    name: str = Field(..., description='Name of the registrant')
    email_id: EmailStr = Field(..., description='Email ID of the registrant')
    quantity: int = Field(..., description='Quantity of the registrant')
    designation: str = Field(..., description='Designation of the registrant')
    organisation: str = Field(..., description='Organisation of the registrant')
    t_shirt_size: str = Field(..., description='T-shirt size of the registrant')
    phone_number: str = Field(..., description='Phone number of the registrant')
    dial_code: str = Field(..., description='Dial code of the registrant')
    country_code: str = Field(..., description='Country code of the registrant')


class KonfHubCaptureRegistrationIn(BaseModel):
    event_id: str = Field(..., description='Event ID for the KonfHub API')
    registration_tz: str = Field(..., description='Registration timezone for the KonfHub API')
    registration_details: Dict[str, List[RegistrationDetail]] = Field(
        ..., description='Registration details for the KonfHub API'
    )
