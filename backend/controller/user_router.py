from fastapi import APIRouter, Depends
from aws.cognito_settings import AccessUser, get_current_user


user_router = APIRouter()


@user_router.get('')
def get_users(current_user: AccessUser = Depends(get_current_user),):
    return {"message": "Hello, world!"}
