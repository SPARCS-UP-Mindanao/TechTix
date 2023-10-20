from http import HTTPStatus
from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Depends, Path
from model.common import Message
from model.admins.admin import AdminIn,AdminOut
from usecase.admin_usecase import AdminUseCase

admin_router = APIRouter()

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
   """
   Get a list of all admins in the current database.

   Parameters:
   - current_user (AccessUser): The currently authenticated user.

   Returns:
   - List[AdminOut]: A list of admin records.

   Responses:
   - 200: List of admins retrieved successfully
   - 404: Admin not found
   - 500: Internal server error
   """
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
   """
   Get details of a single admin from the current database.

   Parameters:
   - entry_id (str): The ID of the admin to retrieve.
   - current_user (AccessUser): The currently authenticated user.

   Returns:
   - AdminOut: Details of the admin.

   Responses:
   - 200: Admin retrieved successfully
   - 404: Admin not found
   - 500: Internal server error
   """
   _ = current_user
   admins_uc = AdminUseCase()
   return admins_uc.get_admin(entry_id)

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
   """
   Create a new admin in the current database.

   Parameters:
   - admin (AdminIn): Details of the admin to be created.
   - current_user (AccessUser): The currently authenticated user.

   Returns:
   - AdminOut: Details of the created admin.

   Responses:
   - 200: Admin created successfully
   - 400: Bad request
   - 500: Internal server error
   """
   _ = current_user
   admin_uc = AdminUseCase()
   return admin_uc.create_admin(admin)

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
   """
   Update an admin's details in the current database.

   Parameters:
   - entry_id (str): The ID of the admin to update.
   - admin (AdminIn): New details for the admin.
   - current_user (AccessUser): The currently authenticated user.

   Returns:
   - AdminOut: Updated details of the admin.

   Responses:
   - 200: Admin updated successfully
   - 400: Bad request
   - 404: Admin not found
   - 500: Internal server error
   """
   _ = current_user
   admin_uc = AdminUseCase()
   return admin_uc.update_admin(entry_id, admin)

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
   """
   Update an admin's details in the current database.

   Parameters:
   - entry_id (str): The ID of the admin to update.
   - admin (AdminIn): New details for the admin.
   - current_user (AccessUser): The currently authenticated user.

   Returns:
   - AdminOut: Updated details of the admin.

   Responses:
   - 200: Admin updated successfully
   - 400: Bad request
   - 404: Admin not found
   - 500: Internal server error
   """
   _ = current_user
   admin_uc = AdminUseCase()
   return admin_uc.delete_admin(entry_id)


