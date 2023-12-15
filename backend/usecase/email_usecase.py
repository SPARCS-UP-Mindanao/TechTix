import json
import os
from datetime import datetime
from http import HTTPStatus
from typing import Tuple

import ulid
from boto3 import client as boto3_client
from constants.common_constants import EmailType
from model.email.email import EmailIn
from model.events.event import Event
from model.registrations.registration import Registration
from utils.logger import logger


class EmailUsecase:
    def __init__(self) -> None:
        self.__sqs_client = boto3_client("sqs", region_name=os.getenv("REGION", "ap-southeast-1"))
        self.__sqs_url = os.getenv("EMAIL_QUEUE")

    def send_email(self, email_in: EmailIn) -> Tuple[HTTPStatus, str]:
        message = None
        try:
            timestamp = datetime.utcnow().isoformat(timespec="seconds")
            event_id = email_in.eventId
            payload = email_in.dict()
            message_id = ulid.ulid()
            response = self.__sqs_client.send_message(
                QueueUrl=self.__sqs_url,
                MessageBody=json.dumps(payload),
                MessageDeduplicationId=f"sparcs-event-{event_id}-{timestamp}-{message_id}",
                MessageGroupId=f"sparcs-event-{event_id}",
            )
            message_id = response.get("MessageId")
            message = f"Queue message success: {message_id}"
            logger.info(message)

        except Exception as e:
            message = f"Failed to send email: {str(e)}"
            logger.error(message)
            return HTTPStatus.INTERNAL_SERVER_ERROR, message

        else:
            return HTTPStatus.OK, message

    def send_event_creation_email(self, event: Event):
        subject = f"Event {event.name} has been created"
        body = [f"Event {event.name} has been created. Please check the event page for more details."]
        salutation = "Dear Sparcs ,"
        regards = ["Best,"]
        email_in = EmailIn(
            to=[event.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.EVENT_CREATION_EMAIL,
            eventId=event.entryId,
        )
        return self.send_email(email_in=email_in)

    def send_registration_creation_email(self, registration: Registration, event: Event):
        subject = f"{event.name} Registration Confirmation"
        body = [
            f"Thank you for registering for the upcoming {event.name}!",
            "We're thrilled to have you join us. If you have any questions or need assistance, please don't hesitate to reach out to us. We're here to help!",
            "See you soon!",
        ]
        salutation = f"Good day {registration.firstName},"
        regards = ["Best,"]
        email_in = EmailIn(
            to=[registration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.REGISTRATION_EMAIL,
            eventId=event.entryId,
        )
        logger.info(f"Sending registration confirmation email to {registration.email}")
        return self.send_email(email_in=email_in)

    def send_event_completion_email(
        self, event_id: str, event_name: str, claim_certificate_url: str, participants: list
    ):
        subject = f"Thank you for joining {event_name}. Claim your certificate now!"
        salutation = "Good day,"
        body = [
            f"A big thank you for attending {event_name}! Your participation made the event truly special.",
            "To claim your certificate, please fill out the evaluation form below. Your feedback is crucial for us to keep improving.",
            claim_certificate_url,
            "We're excited to see you at future SPARCS events – more great experiences await!",
        ]
        regards = ["Best,"]
        for participant in participants:
            email_in = EmailIn(
                to=[participant],
                subject=subject,
                body=body,
                salutation=salutation,
                regards=regards,
                emailType=EmailType.EVALUATION_EMAIL,
                eventId=event_id,
            )
            logger.info(f"Sending event completion email to {participant}")
            self.send_email(email_in=email_in)

        return
