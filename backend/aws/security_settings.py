from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name='x-api-key', auto_error=False)
api_keys = []


def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    """Validate the API Key
    
    :param api_key_header: The API Key to be validated. Defaults to Security(api_key_header).
    :type api_key_header: str
    
    :raises HTTPException: If the API Key is invalid or missing.
    
    :return: The validated API Key
    :rtype: str
    
    """
    if api_key_header in api_keys:
        return api_key_header

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Invalid or missing API Key',
    )
