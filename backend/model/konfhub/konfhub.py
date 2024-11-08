from typing import Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field


class RegistrationDetail(BaseModel):
    name: Optional[str] = Field(None, description='Name of the registrant')
    email_id: Optional[EmailStr] = Field(None, description='Email ID of the registrant')
    quantity: Optional[int] = Field(None, description='Quantity of the registrant')
    designation: Optional[str] = Field(None, description='Designation of the registrant')
    organisation: Optional[str] = Field(None, description='Organisation of the registrant')
    phone_number: Optional[str] = Field(None, description='Phone number of the registrant')
    dial_code: Optional[str] = Field(None, description='Dial code of the registrant')
    country_code: Optional[str] = Field(None, description='Country code of the registrant')
    t_shirt_size: Optional[str] = Field(None, description='T-shirt size of the registrant')


class KonfHubCaptureRegistrationIn(BaseModel):
    event_id: str = Field(..., description='Event ID for the KonfHub API')
    registration_tz: str = Field(..., description='Registration timezone for the KonfHub API')
    registration_details: Dict[str, List[RegistrationDetail]] = Field(
        ..., description='Registration details for the KonfHub API'
    )
