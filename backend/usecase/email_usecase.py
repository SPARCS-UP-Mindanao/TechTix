import json
import logging
import os
from datetime import datetime
from http import HTTPStatus
from typing import Tuple

from boto3 import client as boto3_client
from model.email.email import EmailIn
from model.events.event import Event
from model.registrations.registration import Registration
from repository.events_repository import EventsRepository
from repository.registrations_repository import RegistrationsRepository


class EmailUsecase:
    def __init__(self) -> None:
        self.__sqs_client = boto3_client("sqs", region_name=os.getenv("REGION", "ap-southeast-1"))
        self.__sqs_url = os.getenv("EMAIL_QUEUE")

    def send_email(self, email_in: EmailIn, event_id: str) -> Tuple[HTTPStatus, str]:
        message = None
        try:
            timestamp = datetime.utcnow().isoformat(timespec="seconds")
            payload = email_in.dict()
            response = self.__sqs_client.send_message(
                QueueUrl=self.__sqs_url,
                MessageBody=json.dumps(payload),
                MessageDeduplicationId=f"sparcs-event-{event_id}-{timestamp}",
                MessageGroupId=f"sparcs-event-{event_id}",
            )
            message_id = response.get("MessageId")
            message = f"Queue message success: {message_id}"
            logging.info(message)

        except Exception as e:
            message = f"Failed to send email: {str(e)}"
            logging.error(message)
            return HTTPStatus.INTERNAL_SERVER_ERROR, message

        else:
            return HTTPStatus.OK, message

    def send_event_creation_email(self, event: Event):
        subject = f"Event {event.name} has been created"
        body = [f"Event {event.name} has been created. Please check the event page for more details."]
        salutation = "Dear Sparcs ,"
        regards = ["Best,", "Sparcs Team"]
        email_in = EmailIn(
            to=[os.getenv("SPARCS_GMAIL")],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
        )
        return self.send_email(email_in=email_in, event_id=event.entryId)

    def send_registration_creation_email(self, registration: Registration, event: Event):
        subject = "Registration Confirmation"
        body = [
            f"Thank you for registering for the upcoming {event.name}!",
            "We're thrilled to have you join us. If you have any questions or need assistance, please don't hesitate to reach out to us. We're here to help!",
        ]
        salutation = f"Good day {registration.firstName},"
        regards = ["Best,", "Sparcs Team"]
        email_in = EmailIn(
            to=[registration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
        )
        return self.send_email(email_in=email_in, event_id=event.entryId)

    def send_event_completion_email(self, event_id: str, participants: list):
        subject = "Event Participation"
        body = [
            "It was great to see you. Thank you for your enthusiastic participation! We couldn't have had such a fantastic time without you."
        ]
        salutation = "Good day ,"
        regards = ["Best,", "Sparcs Team"]
        email_in = EmailIn(
            bcc=participants,
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
        )
        return self.send_email(email_in=email_in, event_id=event_id)
