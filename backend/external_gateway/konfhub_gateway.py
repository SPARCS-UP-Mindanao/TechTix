import os
from http import HTTPStatus
from typing import Any, Dict, Optional, Tuple

import requests
from constants.konhub_constants import KonfHubConstants
from model.konfhub.konfhub import KonfHubCaptureRegistrationIn
from utils.logger import logger


class KonfHubGateway:
    def __init__(self):
        pass

    def capture_registration(
        self, konfhub_capture_registration_in: KonfHubCaptureRegistrationIn
    ) -> Tuple[HTTPStatus, Optional[Dict[str, Any]], Optional[str]]:
        try:
            url = KonfHubConstants.CAPTURE_URL
            api_key = os.getenv('KONFHUB_API_KEY')
            headers = {'Content-Type': 'application/json', 'x-api-key': api_key}
            payload = konfhub_capture_registration_in.dict()
            print(payload)
            response = requests.post(url, headers=headers, json=payload, verify=False)
            if response.status_code == 200:
                logger.info(f'Captured registration: {response.json()}')
                return HTTPStatus.OK, response.json(), None
            else:
                raise Exception(f'Failed to capture registration: {response.status_code} - {response.text}')

        except requests.exceptions.SSLError as ssl_err:
            logger.error(f'SSL certificate verification failed: {ssl_err}')
            return HTTPStatus.BAD_GATEWAY, None, str(ssl_err)
        except Exception as e:
            logger.error(f'Failed to capture registration: {e}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, str(e)
