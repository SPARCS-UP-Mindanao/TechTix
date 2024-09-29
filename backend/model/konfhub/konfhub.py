from pydantic import BaseModel, EmailStr
from typing import Dict, List   


class RegistrationDetail(BaseModel):
    name: str
    email_id: EmailStr
    quantity: int
    designation: str
    organisation: str
    t_shirt_size: str
    phone_number: str
    dial_code: str
    country_code: str

class KonfHubCaptureRegistrationIn(BaseModel):
    event_id: str
    registration_tz: str
    registration_details: Dict[str, List[RegistrationDetail]]
