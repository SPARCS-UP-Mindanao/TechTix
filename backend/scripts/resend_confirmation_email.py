import argparse
import os
from http import HTTPStatus

from dotenv import load_dotenv

script_dir = os.path.dirname(os.path.abspath(__file__))
parser = argparse.ArgumentParser()
parser.add_argument(
    '--env-file', type=str, default=os.path.join(script_dir, '..', '.env'), help='Path to the .env file'
)
parser.add_argument('--email', type=str, required=True, help='Registrant email address')
parser.add_argument('--event-id', type=str, required=True, help='Event ID')
args = parser.parse_args()
load_dotenv(dotenv_path=args.env_file)


from usecase.pycon_registration_email_notification import (
    PyConRegistrationEmailNotification,
)
from utils.logger import logger

if __name__ == '__main__':
    usecase = PyConRegistrationEmailNotification()
    response = usecase.resend_confirmation_email(event_id=args.event_id, email=args.email)
    if response.status_code == HTTPStatus.OK:
        logger.info(f'Successfully resent confirmation email to {args.email} for event {args.event_id}')
    else:
        logger.error(f'Failed to resend confirmation email: {response.content}')
