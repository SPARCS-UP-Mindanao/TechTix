import os
from datetime import datetime
from model.entities import Entities
from pydantic import BaseModel, Extra, Field
from pynamodb.attributes import UnicodeAttribute
#from pynamodb.models import Model

class Admin(Entities, discriminator='Admin'): # Inherit values from entities table
   class Meta: 
      table_name = os.getenv('ADMINS_TABLE')
      region = os.getenv('REGION')
      billing_mode = 'PAY_PER_REQUEST'
   # hk: Admin
   # rk: v<version_number>#<entry_id>
   email = UnicodeAttribute(null=True)
   firstName = UnicodeAttribute(null=True)
   lastName = UnicodeAttribute(null=True)
   position = UnicodeAttribute(null=True)
   address = UnicodeAttribute(null=True)
   contactNumber = UnicodeAttribute(null=True)

class AdminIn(BaseModel):
   class Config:
      extra = Extra.forbid   # Prevents extra fields to be inputted

   email: str = Field(None, title= "Email")
   firstName: str = Field(None, title = "First Name")
   lastName: str = Field(None, title = "Last Name")
   position: str = Field(None, title ="Position")
   address: str = Field(None, title = "Address")
   contactNumber: str = Field(None, title = "Contact Number")


class AdminOut(AdminIn):
   class Config:
      extra = Extra.ignore #ignores extra fields
   entryId: str = Field(..., title="ID")
   createDate: datetime = Field(..., title="Created At")
   updateDate: datetime = Field(..., title="Updated At")
   createdBy: str = Field(..., title="Created By")
   updatedBy: str = Field(..., title="Updated By")