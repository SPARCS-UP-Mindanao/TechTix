from constants.konhub_constants import KonfHubConstants
from model.konfhub.konfhub import KonfHubCaptureRegistrationIn
import requests
import os
from utils.logger import logger
from http import HTTPStatus
from typing import Tuple, Optional, Dict, Any


class KonfHubGateway:
    def __init__(self):
        pass

    def capture_registration(self, konfhub_capture_registration_in: KonfHubCaptureRegistrationIn) -> Tuple[HTTPStatus, Optional[Dict[str, Any]], Optional[str]]:
        try:
            url = KonfHubConstants.CAPTURE_URL
            headers = {
                'Content-Type': 'application/json',
                'x-api-key': os.getenv('KONFHUB_API_KEY')
            }
            payload = konfhub_capture_registration_in.dict()
            response = requests.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                logger.info(f"Captured registration: {response.json()}")
                return HTTPStatus.OK, response.json(), None
            else:
                raise Exception(f"Failed to capture registration: {response.status_code} - {response.text}")

        except Exception as e:
            logger.error(f"Failed to capture registration: {e}")
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, str(e)
