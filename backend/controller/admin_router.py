from http import HTTPStatus
from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path
from model.common import Message
from model.admins.admin import AdminIn,AdminOut
from usecase.admin_usecase import AdminUseCase

admin_router = APIRouter()

#GET ADMINS
@admin_router.get( 
   '',
   response_model=List[AdminOut],
   responses={
      404: {"model": Message, "description": "Admin not found"},
      500: {"model": Message, "description": "Internal server error"},
   },
   summary="Get Admins",
)
@admin_router.get(
   '/{entryId}',
   response_model=List[AdminOut],
   response_model_exclude_none=True,
   response_model_exclude_unset=True,
   include_in_schema=False,
)
def get_admins(
   current_user: AccessUser = Depends(get_current_user),
):
   _ = current_user
   admin_uc = AdminUseCase()
   return admin_uc.get_admins()

@admin_router.get(
   '/{entryId}',
   response_model=AdminOut,
   responses={
      404: {"model": Message, "description": "Admin not found"},
      500: {"model": Message, "description": "Internal server error"},
   },
   summary="Get Admin",
)
@admin_router.get(
   '/{entryId}/',
   response_model=AdminOut,
   response_model_exclude_none=True,
   response_model_exclude_unset=True,
   include_in_schema=False,
)
def get_admin(
   entry_id: str = Path(..., title='admin Id', alias=CommonConstants.ENTRY_ID),
   current_user: AccessUser = Depends(get_current_user),
):
   _ = current_user
   admins_uc = AdminUseCase()
   return admins_uc.get_admin(entry_id)

# POST ADMIN
@admin_router.post(
   '',
   response_model=AdminOut,
   responses={
      400: {"model": Message, "description": "Bad request"},
      500: {"model": Message, "description": "Internal server error"},
   },
   summary="Create Admin",
)
@admin_router.post(
   '/',
   response_model=AdminOut,
   response_model_exclude_none=True,
   response_model_exclude_unset=True,
   include_in_schema=False,
)
def create_admin(
   admin: AdminIn,
   current_user: AccessUser = Depends(get_current_user),
):
   _ = current_user
   admin_uc = AdminUseCase()
   return admin_uc.create_admin(admin)

# UPDATE ADMIN
@admin_router.put(
   '/{entryId}',
   response_model=AdminOut,
   responses={
      400: {"model": Message, "description": "Bad request"},
      404: {"model": Message, "description": "Admin not found"},
      500: {"model": Message, "description": "Internal server error"},
   },
   summary="Update Admin",
)
@admin_router.put(
   '/{entryId}/',
   response_model=AdminOut,
   response_model_exclude_none=True,
   response_model_exclude_unset=True,
   include_in_schema=False,
)
def update_admin(
   admin: AdminIn,
   entry_id: str = Path(..., title='Admin Id', alias=CommonConstants.ENTRY_ID),
   current_user: AccessUser = Depends(get_current_user),
):
   _ = current_user
   admin_uc = AdminUseCase()
   return admin_uc.update_admin(entry_id, admin)

# DELETE ADMIN
@admin_router.delete(
   '/{entryId}',
   status_code=HTTPStatus.NO_CONTENT,
   responses={
      204: {'description': 'Admin entry deletion success', 'content': None},
   },
   summary="Delete Admin",
)
@admin_router.delete(
   '/{entryId}/',
   status_code=HTTPStatus.NO_CONTENT,
   include_in_schema=False,
)
def delete_admin(
   entry_id: str = Path(..., title='admin Id', alias=CommonConstants.ENTRY_ID),
   current_user: AccessUser = Depends(get_current_user),
):
   _ = current_user
   admin_uc = AdminUseCase()
   return admin_uc.delete_admin(entry_id)


