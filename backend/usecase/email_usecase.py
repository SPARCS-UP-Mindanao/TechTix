import json
import logging
import os
from datetime import datetime
from http import HTTPStatus
from typing import Tuple

from boto3 import client as boto3_client
from model.email.email import EmailIn
from model.events.event import Event


class EmailUsecase:
    def __init__(self) -> None:
        self.__sqs_client = boto3_client('sqs', region_name=os.getenv('REGION', 'ap-southeast-1'))
        self.__sqs_url = os.getenv('EMAIL_QUEUE')

    def send_email(self, email_in: EmailIn, event_id: str) -> Tuple[HTTPStatus, str]:
        message = None
        try:
            timestamp = datetime.utcnow().isoformat(timespec='seconds')
            payload = email_in.dict()
            response = self.__sqs_client.send_message(
                QueueUrl=self.__sqs_url,
                MessageBody=json.dumps(payload),
                MessageDeduplicationId=f'sparcs-event-{event_id}-{timestamp}',
                MessageGroupId=f'sparcs-event-{event_id}',
            )
            message_id = response.get('MessageId')
            message = f'Queue message success: {message_id}'
            logging.info(message)

        except Exception as e:
            message = f'Failed to send email: {str(e)}'
            logging.error(message)
            return HTTPStatus.INTERNAL_SERVER_ERROR, message

        else:
            return HTTPStatus.OK, message

    def send_event_creation_email(self, event: Event):
        subject = f'Event {event.name} has been created'
        content = f'Event {event.name} has been created. Please check the event page for more details.'
        email_in = EmailIn(
            to=os.getenv('SPARCS_GMAIL'),
            subject=subject,
            content=content,
        )
        return self.send_email(email_in=email_in, event_id=event.entryId)
