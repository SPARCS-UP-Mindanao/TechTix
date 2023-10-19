import json
from http import HTTPStatus
from typing import List, Union

from model.admins.admin import AdminIn,AdminOut
from repository.admins_repository import AdminsRepository
from starlette.responses import JSONResponse


class AdminUseCase:
   def __init__(self):
      self.__admins_repository = AdminsRepository()

   def create_admin(self, admin_in: AdminIn) -> Union[JSONResponse, AdminOut]:
      status, admin, message = self.__admins_repository.store_admin(admin_in)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})
      admin_data = self.__convert_data_entry_to_dict(admin)
      return AdminOut(**admin_data)

   def update_admin(self, admin_id: str, admin_in: AdminIn) -> Union[JSONResponse, AdminOut]:
      status, admin, message = self.__admins_repository.query_admins(admin_id)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      status, update_admin, message = self.__admins_repository.update_admin(admin_entry=admin, admin_in=admin_in)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      admin_data = self.__convert_data_entry_to_dict(update_admin)
      return AdminOut(**admin_data)

   def get_admin(self, admin_id: str) -> Union[JSONResponse, AdminOut]:
      status, admin, message = self.__admins_repository.query_admins(admin_id)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      admin_data = self.__convert_data_entry_to_dict(admin)
      return AdminOut(**admin_data)

   def get_admins(self) -> Union[JSONResponse, List[AdminOut]]:
      status, admins, message = self.__admins_repository.query_admins()
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      admins_data = [self.__convert_data_entry_to_dict(admin) for admin in admins]
      return [AdminOut(**admin_data) for admin_data in admins_data]
   def delete_admin(self, admin_id: str) -> Union[None, JSONResponse]:
      status, admin, message = self.__admins_repository.query_admins(admin_id)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      status, message = self.__admins_repository.delete_admin(admin_entry=admin)
      if status != HTTPStatus.OK:
         return JSONResponse(status_code=status, content={'message': message})

      return None

   @staticmethod
   def __convert_data_entry_to_dict(data_entry):
      return json.loads(data_entry.to_json())
