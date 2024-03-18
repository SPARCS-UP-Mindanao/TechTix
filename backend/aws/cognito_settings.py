import os  # from the computer, it finds a .env file

from constants.common_constants import UserRoles
from fastapi import Depends, HTTPException
from fastapi_cloudauth import Cognito
from pydantic import BaseModel, Field


class AccessUser(BaseModel):
    sub: str
    groups: list = Field([], alias='cognito:groups')
    username: str = None


__auth = Cognito(
    region=os.environ['REGION'],
    userPoolId=os.environ['USER_POOL_ID'],
    client_id=os.environ['USER_POOL_CLIENT_ID'],
)


def get_current_user(
    current_user: AccessUser = Depends(__auth.claim(AccessUser)),
) -> AccessUser:
    """Get the current user

    :param current_user: The current user
    :type current_user: AccessUser

    :raises HTTPException: Raises an invalid access token when the current user is invalid

    :return: The current user
    :rtype: AccessUser

    """
    if not current_user.username:
        raise HTTPException(status_code=401, detail='Invalid access token')

    os.environ['CURRENT_USER'] = current_user.sub
    is_super_admin = UserRoles.SUPER_ADMIN.value in current_user.groups
    os.environ['CURRENT_USER_IS_ADMIN'] = str(is_super_admin)
    message = f'CurrentUser: {current_user.sub} {current_user.groups}'
    print(message)
    return current_user
