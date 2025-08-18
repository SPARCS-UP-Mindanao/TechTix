from enum import Enum
from typing import Optional

import os
from datetime import datetime
from pydantic import BaseModel, EmailStr, Extra, Field
from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex, LocalSecondaryIndex
from pynamodb.models import Model

from pydantic import BaseModel, EmailStr, Field, HttpUrl, root_validator, validator


class SocialMedia(BaseModel):
    linkedIn: Optional[HttpUrl] = Field(None, title='LinkedIn Profile URL')
    facebook: Optional[HttpUrl] = Field(None, title='Facebook Profile URL')


class TicketTypes(Enum):
    CODER = 'coder'
    KASOSYO = 'kasosyo'


class TShirtType(Enum):
    UNISEX = 'unisex'
    FEMALE = 'female'


class TShirtSize(Enum):
    XS = 'XS'
    S = 'S'
    M = 'M'
    L = 'L'
    XL = 'XL'
    XXL = 'XXL'
    XXXL = 'XXXL'


class PyconRegistration(BaseModel):
    firstName: str = Field(title='First Name')
    lastName: str = Field(title='Last Name')
    nickname: str = Field(title='Nickname')
    pronouns: str = Field(title='Pronouns')
    email: EmailStr = Field(title='Email')
    contactNumber: str = Field(title='Contact Number', pattern=r'^\+?[1-9]\d{1,14}$')  # international number
    organization: str = Field(title='Affiliated Company or Organization')
    jobTitle: str = Field(title='Job Title', description='Your current job title or role in tech')
    socials: Optional[SocialMedia] = Field(
        None, title='Social Media Profiles', description='Links to your social media profiles'
    )
    ticketType: TicketTypes = Field(title='Ticket Type', description='Type of ticket you are registering for')
    sprintDay: bool = Field(
        False, title='Sprint Day Participation', description='Will you be participating in the sprint day?'
    )
    availTShirt: bool = Field(
        False, title='T-Shirt Availability', description='Do you want to buy an exclusive PyCon T-shirt?'
    )
    shirtType: Optional[TShirtType] = Field(
        None, title='T-Shirt Type', description='Type of the T-shirt you want to order'
    )
    shirtSize: Optional[TShirtSize] = Field(
        None, title='T-Shirt Size', description='Size of the T-shirt you want to order'
    )
    communityInvolvement: bool = Field(
        False, title='Community Involvement', description='Are you a member of any local tech community?'
    )
    futureVolunteer: bool = Field(
        False, title='Future Volunteer Interest', description='Would you like to volunteer in the future?'
    )
    dietaryRestrictions: str = Field(
        '', title='Dietary Restrictions', description='Any dietary restrictions or allergies'
    )
    accessibilityNeeds: str = Field(
        '', title='Accessibility Needs', description='Any specific accessibility needs or requests'
    )
    discountCode: Optional[str] = Field(
        None, title='Discount Code', description='If you have a discount code, please enter it here'
    )
    imageId: Optional[str] = Field(None, title='Image ID Object Key')


    @validator('firstName', 'lastName', 'nickname')
    def normalize_names(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Name fields cannot be empty')
        return ' '.join(word.capitalize() for word in v.split())

    @root_validator(pre='false')
    def check_shirt_availability(cls, values):
        if values.get('availTShirt') and (values.get('shirtType') is None or values.get('shirtSize') is None):
            raise ValueError('If availTShirt is True, then shirtType and shirtSize must be provided.')
        return values

class Registration(Model):
    class Meta:
        table_name = os.getenv('REGISTRATIONS_TABLE')
        region = os.getenv('REGION')
        billing_mode = 'PAY_PER_REQUEST'
    
    registrationId = UnicodeAttribute(null=False)
    hashKey = UnicodeAttribute(hash_key=True)
    rangeKey = UnicodeAttribute(range_key=True)

    firstName = UnicodeAttribute(null=True)
    lastName = UnicodeAttribute(null=True)
    nickname = UnicodeAttribute(null=True)
    pronouns = UnicodeAttribute(null=True)
    
    email = UnicodeAttribute(null=True)
    contactNumber = UnicodeAttribute(null=True)

    organization = UnicodeAttribute(null=True)
    jobTitle = UnicodeAttribute(null=True)

    socials=UnicodeAttribute(null=True)

    ticketType = UnicodeAttribute(null=True)
    sprintDay=UnicodeAttribute(null=True)
    availTShirt=UnicodeAttribute(null=True)
    shirtType=UnicodeAttribute(null=True)
    shirtSize=UnicodeAttribute(null=True)

    communityInvolvement=UnicodeAttribute(null=True)
    futureVolunteer=UnicodeAttribute(null=True)

    dietaryRestrictions = UnicodeAttribute(null=True)
    accessibilityNeeds = UnicodeAttribute(null=True)

    imageId = UnicodeAttribute(null=False)

    discountCode = UnicodeAttribute(null=True)

    paymentId = UnicodeAttribute(null=True)
    gcashPayment = UnicodeAttribute(null=True)
    referenceNumber = UnicodeAttribute(null=True)
    amountPaid = NumberAttribute(null=True)
    transactionId = UnicodeAttribute(null=True)
    
    registrationEmailSent = BooleanAttribute(default=False)
    confirmationEmailSent = BooleanAttribute(default=False)

    createDate = UnicodeAttribute(null=False)
    updateDate = UnicodeAttribute(null=False)

class PyconRegistrationIn(PyconRegistration):

    gcashPayment = UnicodeAttribute(null=True)
    referenceNumber = UnicodeAttribute(null=True)
    amountPaid = NumberAttribute(null=True)
    transactionId = UnicodeAttribute(null=True)
