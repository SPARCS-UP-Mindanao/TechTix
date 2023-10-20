import os
from datetime import datetime
from model.entities import Entities
from pydantic import BaseModel, Extra, Field
from pynamodb.attributes import UnicodeAttribute

class Admin(Entities, discriminator='Admin'):
   """
   A class representing Admin entities.

   Attributes:
   - email (str): The email address of the admin.
   - firstName (str): The first name of the admin.
   - lastName (str): The last name of the admin.
   - position (str): The position or role of the admin.
   - address (str): The address of the admin.
   - contactNumber (str): The contact number of the admin.
   """

   class Meta:
      """
      Meta configuration for the Admin class.

      Attributes:
      - region (str): The AWS region where the data is stored.
      - billing_mode (str): The billing mode for the database table (e.g., 'PAY_PER_REQUEST').
      """
      table_name = os.getenv('ENTITIES_TABLE')
      region = os.getenv('REGION')
      billing_mode = 'PAY_PER_REQUEST'

   email = UnicodeAttribute(null=True)
   firstName = UnicodeAttribute(null=True)
   lastName = UnicodeAttribute(null=True)
   position = UnicodeAttribute(null=True)
   address = UnicodeAttribute(null=True)
   contactNumber = UnicodeAttribute(null=True)

class AdminIn(BaseModel):
   """
   A class representing AdminIn entities.

   Attributes:
   - email (str): The email address of the admin.
   - firstName (str): The first name of the admin.
   - lastName (str): The last name of the admin.
   - position (str): The position or role of the admin.
   - address (str): The address of the admin.
   - contactNumber (str): The contact number of the admin.
   """

   class Config:
      extra = Extra.forbid   # Prevents extra fields from being inputted

   email: str = Field(None, title="Email")
   firstName: str = Field(None, title="First Name")
   lastName: str = Field(None, title="Last Name")
   position: str = Field(None, title="Position")
   address: str = Field(None, title="Address")
   contactNumber: str = Field(None, title="Contact Number")

class AdminOut(AdminIn):
   """
   A class representing AdminOut entities.

   Attributes:
   - entryId (str): The ID of the admin entry.
   - createDate (datetime): The creation date of the admin entry.
   - updateDate (datetime): The last update date of the admin entry.
   - createdBy (str): The user who created the admin entry.
   - updatedBy (str): The user who last updated the admin entry.
   """

   class Config:
      extra = Extra.ignore  # Ignores extra fields

   entryId: str = Field(..., title="ID")
   createDate: datetime = Field(..., title="Created At")
   updateDate: datetime = Field(..., title="Updated At")
   createdBy: str = Field(..., title="Created By")
   updatedBy: str = Field(..., title="Updated By")
