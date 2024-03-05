import json
import os
from datetime import datetime
from http import HTTPStatus
from typing import List, Tuple

import ulid
from boto3 import client as boto3_client
from constants.common_constants import EmailType
from model.email.email import EmailIn
from model.events.event import Event
from model.preregistrations.preregistration import PreRegistration, PreRegistrationPatch
from model.preregistrations.preregistrations_constants import AcceptanceStatus
from model.registrations.registration import Registration
from repository.preregistrations_repository import PreRegistrationsRepository
from utils.logger import logger


class EmailUsecase:
    def __init__(self) -> None:
        self.__sqs_client = boto3_client('sqs', region_name=os.getenv('REGION', 'ap-southeast-1'))
        self.__sqs_url = os.getenv('EMAIL_QUEUE')
        self.__preregistration_repository = PreRegistrationsRepository()

    def send_email(self, email_in: EmailIn) -> Tuple[HTTPStatus, str]:
        message = None
        try:
            timestamp = datetime.utcnow().isoformat(timespec='seconds')
            event_id = email_in.eventId
            payload = email_in.dict()
            message_id = ulid.ulid()
            response = self.__sqs_client.send_message(
                QueueUrl=self.__sqs_url,
                MessageBody=json.dumps(payload),
                MessageDeduplicationId=f'sparcs-event-{event_id}-{timestamp}-{message_id}',
                MessageGroupId=f'sparcs-event-{event_id}',
            )
            message_id = response.get('MessageId')
            message = f'Queue message success: {message_id}'
            logger.info(message)

        except Exception as e:
            message = f'Failed to send email: {str(e)}'
            logger.error(message)
            return HTTPStatus.INTERNAL_SERVER_ERROR, message

        else:
            return HTTPStatus.OK, message

    def send_event_creation_email(self, event: Event):
        subject = f'Event {event.name} has been created'
        body = [f'Event {event.name} has been created. Please check the event page for more details.']
        salutation = 'Dear Sparcs ,'
        regards = ['Best,']
        email_in = EmailIn(
            to=[event.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.EVENT_CREATION_EMAIL,
            eventId=event.eventId,
        )
        return self.send_email(email_in=email_in)

    def send_registration_creation_email(self, registration: Registration, event: Event):
        subject = f'{event.name} Registration Confirmation'
        body = [
            f'Thank you for registering for the upcoming {event.name}!',
            "We're thrilled to have you join us. If you have any questions or need assistance, please don't hesitate to reach out to us. We're here to help!",
            'See you soon!',
        ]
        salutation = f'Good day {registration.firstName},'
        regards = ['Best,']
        email_in = EmailIn(
            to=[registration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.REGISTRATION_EMAIL,
            eventId=event.eventId,
        )
        logger.info(f'Sending registration confirmation email to {registration.email}')
        return self.send_email(email_in=email_in)

    def send_accept_reject_status_email(self, preregistrations: List[PreRegistration], event: Event):
        for preregistration in preregistrations:
            email_sent = preregistration.acceptanceEmailSent
            if email_sent:
                return

            should_send_acceptance = (
                preregistration.acceptanceStatus and preregistration.acceptanceStatus == AcceptanceStatus.ACCEPTED.value
            )
            if should_send_acceptance:
                self.send_preregistration_acceptance_email(preregistration=preregistration, event=event)
                logger.info(f'Acceptance email sent to {preregistration.email} for event {event.eventId}')
            else:
                self.send_preregistration_rejection_email(preregistration=preregistration, event=event)
                logger.info(f'Rejection email sent to {preregistration.email} for event {event.eventId}')

            self.__preregistration_repository.update_preregistration(
                preregistration_entry=preregistration, preregistration_in=PreRegistrationPatch(acceptanceEmailSent=True)
            )

    def send_preregistration_creation_email(self, preregistration: PreRegistration, event: Event):
        subject = f'Welcome to {event.name} Pre-Registration!'
        body = [
            'We’ve received your pre-registration and are thrilled to have you on board. Your application is under review, and we’re just as excited as you are to get things moving!',
            'Stay tuned for updates, and in the meantime, feel free to check out more details on our social media channels or reach out with any questions. We’re here to help!',
        ]

        salutation = f'Good day {preregistration.firstName},'
        regards = ['Best,']
        email_in = EmailIn(
            to=[preregistration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.PREREGISTRATION_EMAIL,
            eventId=event.eventId,
        )
        logger.info(f'Sending pre-registration email to {preregistration.email}')
        return self.send_email(email_in=email_in)

    def send_preregistration_acceptance_email(self, preregistration: PreRegistration, event: Event):
        subject = f'You’re In! {event.name} Pre-Registration Accepted 🌟'
        salutation = f'Good day {preregistration.firstName},'
        body = [
            f'Congratulations! We are over the moon to let you know that your pre-registration for {event.name} has been accepted! This is going to be an extraordinary experience, and we can’t wait to share it with you.',
            f'To complete your registration and secure your spot, please follow this link: https://techtix.app/{event.eventId}/registration',
            'If you have any questions or need assistance, we’re here for you. Let’s make this event unforgettable!',
        ]
        regards = ['Best,']
        email_in = EmailIn(
            to=[preregistration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.PREREGISTRATION_EMAIL,
            eventId=event.eventId,
        )
        logger.info(f'Sending pre-registration acceptance email to {preregistration.email}')
        return self.send_email(email_in=email_in)

    def send_preregistration_rejection_email(self, preregistration: PreRegistration, event: Event):
        subject = f'Regretful News Regarding Your Pre-Registration for {event.name}'
        body = [
            f'Dear {preregistration.firstName}',
            '',
            f'We hope this message finds you well. It is with genuine regret that we inform you that your pre-registration for the upcoming {event.name} has been declined.',
            '',
            'We understand the disappointment and frustration this may cause, and for that, we sincerely apologize. Please know that our decision was made after careful consideration and was not taken lightly.',
            '',
            'Despite this setback, we want to extend a heartfelt invitation to you for our next event at Sparcs. We believe that your enthusiasm and passion would greatly contribute to the vibrant atmosphere of our community, and we would be honored to have you join us.',
            '',
            'We value your support and understanding, and we genuinely hope to welcome you to our future events. Should you have any questions or require further assistance, please do not hesitate to reach out to us.',
            '',
            'Thank you for your understanding.',
            '',
            'Warm regards,',
            'Your Sparcs Team',
        ]
        salutation = f'Good day {preregistration.firstName},'
        regards = ['Best,']
        email_in = EmailIn(
            to=[preregistration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.PREREGISTRATION_EMAIL,
            eventId=event.eventId,
        )
        logger.info(f'Sending pre-registration rejection email to {preregistration.email}')
        return self.send_email(email_in=email_in)

    def send_event_completion_email(
        self,
        event_id: str,
        event_name: str,
        claim_certificate_url: str,
        participants: list,
    ):
        subject = f'Thank you for joining {event_name}. Claim your certificate now!'
        salutation = 'Good day,'
        body = [
            f'A big thank you for attending {event_name}! Your participation made the event truly special.',
            'To claim your certificate, please fill out the evaluation form below. Your feedback is crucial for us to keep improving.',
            claim_certificate_url,
            "We're excited to see you at future SPARCS events – more great experiences await!",
        ]
        regards = ['Best,']
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
            logger.info(f'Sending event completion email to {participant}')
            self.send_email(email_in=email_in)

        return
