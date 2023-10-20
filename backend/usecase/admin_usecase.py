import json
from http import HTTPStatus
from typing import List, Union

from model.admins.admin import AdminIn, AdminOut
from repository.admins_repository import AdminsRepository
from starlette.responses import JSONResponse

class AdminUseCase:
   """
   Use case for handling Admin entities.
   This class provides methods for creating, updating, retrieving, and deleting Admin entities.
   """

   def __init__(self):
      """
      Initialize the AdminUseCase with an instance of AdminsRepository.
      """
      self.__admins_repository = AdminsRepository()

   def create_admin(self, admin_in: AdminIn) -> Union[JSONResponse, AdminOut]:
      """
      Create a new Admin entity.

      Parameters:
      - admin_in (AdminIn): The input data for creating the Admin entity.

      Returns:
      - Union[JSONResponse, AdminOut]: A JSON response or the created Admin entity.
      """
      status, admin, message = self.__admins_repository.store_admin(admin_in)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})
      admin_data = self.__convert_data_entry_to_dict(admin)
      return AdminOut(**admin_data)

   def update_admin(self, admin_id: str, admin_in: AdminIn) -> Union[JSONResponse, AdminOut]:
      """
      Update an existing Admin entity.

      Parameters:
      - admin_id (str): The ID of the Admin entity to update.
      - admin_in (AdminIn): The updated data for the Admin entity.

      Returns:
      - Union[JSONResponse, AdminOut]: A JSON response or the updated Admin entity.
      """
      status, admin, message = self.__admins_repository.query_admins(admin_id)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      status, update_admin, message = self.__admins_repository.update_admin(admin_entry=admin, admin_in=admin_in)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      admin_data = self.__convert_data_entry_to_dict(update_admin)
      return AdminOut(**admin_data)

   def get_admin(self, admin_id: str) -> Union[JSONResponse, AdminOut]:
      """
      Retrieve an Admin entity by ID.

      Parameters:
      - admin_id (str): The ID of the Admin entity to retrieve.

      Returns:
      - Union[JSONResponse, AdminOut]: A JSON response or the retrieved Admin entity.
      """
      status, admin, message = self.__admins_repository.query_admins(admin_id)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      admin_data = self.__convert_data_entry_to_dict(admin)
      return AdminOut(**admin_data)

   def get_admins(self) -> Union[JSONResponse, List[AdminOut]]:
      """
      Retrieve a list of all Admin entities.

      Returns:
      - Union[JSONResponse, List[AdminOut]]: A JSON response or a list of retrieved Admin entities.
      """
      status, admins, message = self.__admins_repository.query_admins()
      if status is not HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      admins_data = [self.__convert_data_entry_to_dict(admin) for admin in admins]
      return [AdminOut(**admin_data) for admin_data in admins_data]

   def delete_admin(self, admin_id: str) -> Union[None, JSONResponse]:
      """
      Delete an Admin entity by ID.

      Parameters:
      - admin_id (str): The ID of the Admin entity to delete.

      Returns:
      - Union[None, JSONResponse]: A JSON response or None if the deletion is successful.
      """
      status, admin, message = self.__admins_repository.query_admins(admin_id)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      status, message = self.__admins_repository.delete_admin(admin_entry=admin)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      return None

   @staticmethod
   def __convert_data_entry_to_dict(data_entry):
      """
      Convert a data entry to a dictionary.

      Parameters:
      - data_entry: The data entry to convert.

      Returns:
      - dict: The converted data as a dictionary.
      """
      return json.loads(data_entry.to_json())
