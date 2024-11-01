import json
import os
from datetime import datetime, timezone
from http import HTTPStatus
from typing import List, Tuple

import ulid
from boto3 import client as boto3_client
from constants.common_constants import EmailType, SpecialEmails, SpecialSenders
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
        self.__sender_name_map = {
            SpecialEmails.DURIAN_PY.value: SpecialSenders.DURIAN_PY.value,
            SpecialEmails.AWSUG_DAVAO.value: SpecialSenders.AWSUG_DAVAO.value,
            SpecialEmails.GDG_DAVAO.value: SpecialSenders.GDG_DAVAO.value,
        }
        self.__event_email = None

    def __send_email_handler(self, email_in_list: List[EmailIn], event: Event) -> Tuple[HTTPStatus, str]:
        """Send an email to the queue

        :param email_in_list: The email list to be sent
        :type Event: EmailIn

        :param event: The event to be sent
        :type event: Event

        :return: The status and message
        :rtype: Tuple[HTTPStatus, str]

        """
        
        #Check if event has konfhub and exclude it from the Email Service
        if self.__event_email and event.konfhubId and event.konfhubApiKey:
            logger.info(f'Skipping sending email to {self.__event_email} because it is a special email')
            return

        timestamp = datetime.now(timezone.utc).isoformat(timespec='seconds')
        payload = [email_in.dict() for email_in in email_in_list]
        event_id = email_in_list[0].eventId
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

    def send_batch_email(self, email_in_list: List[EmailIn], event: Event) -> Tuple[HTTPStatus, str]:
        """Send an email to the queue

        :param email_in_list: The email list to be sent
        :type email_in: EmailIn

        :param event: The event to be sent
        :type event: Event
        
        :return: The status and message
        :rtype: Tuple[HTTPStatus, str]

        """
        message = None
        try:
            self.__send_email_handler(email_in_list=email_in_list, event=event)

        except Exception as e:
            message = f'Failed to send email: {str(e)}'
            logger.error(message)
            return HTTPStatus.INTERNAL_SERVER_ERROR, message

        else:
            return HTTPStatus.OK, message

    def send_email(self, email_in: EmailIn, event: Event) -> Tuple[HTTPStatus, str]:
        """Send an email to the queue

        :param email_in: The email to be sent
        :type email_in: EmailIn

        :param event: The event to be sent
        :type event: Event

        :return: The status and message
        :rtype: Tuple[HTTPStatus, str]

        """
        return self.send_batch_email(email_in_list=[email_in], event=event)

    def send_event_creation_email(self, event: Event) -> Tuple[HTTPStatus, str]:
        """Send an email to the queue. If the preregistration is accepted, send an acceptance email. If the preregistration is rejected, send a rejection email.

        :param event: The event to be sent
        :type event: Event

        :return: The status and message
        :rtype: Tuple[HTTPStatus, str]

        """
        subject = f'Event {event.name} has been created'
        body = [f'Event {event.name} has been created. Please check the event page for more details.']
        salutation = 'Dear Sparcs ,'
        regards = ['Best,']

        self.__event_email = event.email

        # Check if email is a special sender to add to the regards message
        if special_sender := self.__sender_name_map.get(event.email):
            regards.append(special_sender)

        is_special_email = event.email in [email.value for email in SpecialEmails]
        is_sparcs = not is_special_email
        email_in = EmailIn(
            to=[event.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.EVENT_CREATION_EMAIL.value,
            eventId=event.eventId,
            isSparcs=is_sparcs,
        )
        return self.send_email(email_in=email_in, event=event)

    def send_registration_creation_email(self, registration: Registration, event: Event) -> Tuple[HTTPStatus, str]:
        """Send an email to the queue.

        :param registration: The registration to be sent
        :type registration: Registration

        :param event: The event to be sent
        :type event: Event

        :return: The status and message
        :rtype: Tuple[HTTPStatus, str]

        """
        is_special_email = event.email in [email.value for email in SpecialEmails]
        is_sparcs = not is_special_email
        self.__event_email = event.email

        subject = f'{event.name} Registration Confirmation'
        body = [
            f'Thank you for registering for the upcoming {event.name}!',
            f"We're thrilled to have you join us. If you have any questions or need assistance, please don't hesitate to reach out to us at {event.email}. We're here to help!",
            'See you soon!',
        ]
        salutation = f'Good day {registration.firstName},'
        regards = ['Best,']

        # Check if email is a special sender to add to the regards message
        if special_sender := self.__sender_name_map.get(event.email):
            regards.append(special_sender)

        email_in = EmailIn(
            to=[registration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.REGISTRATION_EMAIL.value,
            eventId=event.eventId,
            isSparcs=is_sparcs,
        )
        logger.info(f'Sending registration confirmation email to {registration.email}')
        return self.send_email(email_in=email_in, event=event)

    def send_accept_reject_status_email(
        self, preregistrations: List[PreRegistration], event: Event
    ) -> Tuple[HTTPStatus, str]:
        """Send an email to the queue. If the preregistration is accepted, send an acceptance email. If the preregistration is rejected, send a rejection email.

        :param preregistrations: The preregistrations to be sent
        :type preregistrations: List[PreRegistration]

        :param event: The event to be sent
        :type event: Event

        """
        emails = []
        self.__event_email = event.email
        for preregistration in preregistrations:
            if preregistration.acceptanceEmailSent:
                continue

            should_send_acceptance = (
                preregistration.acceptanceStatus and preregistration.acceptanceStatus == AcceptanceStatus.ACCEPTED.value
            )
            if should_send_acceptance:
                email = self.send_preregistration_acceptance_email(preregistration=preregistration, event=event)
                logger.info(f'Acceptance email sent to {preregistration.email} for event {event.eventId}')
            else:
                email = self.send_preregistration_rejection_email(preregistration=preregistration, event=event)
                logger.info(f'Rejection email sent to {preregistration.email} for event {event.eventId}')

            emails.append(email)

            self.__preregistration_repository.update_preregistration(
                preregistration_entry=preregistration, preregistration_in=PreRegistrationPatch(acceptanceEmailSent=True)
            )

        return self.send_batch_email(email_in_list=emails, event=Event)

    def send_preregistration_creation_email(
        self, preregistration: PreRegistration, event: Event
    ) -> Tuple[HTTPStatus, str]:
        """Send an email to the queue.

        :param preregistration: The preregistration to be sent
        :type preregistration: PreRegistration

        :param event: The event to be sent
        :type event: Event

        :return: The status and message
        :rtype: Tuple[HTTPStatus, str]

        """
        self.__event_email = event.email
        is_special_email = event.email in [email.value for email in SpecialEmails]
        is_sparcs = not is_special_email
        subject = f'Welcome to {event.name} Pre-Registration!'
        body = [
            'We’ve received your pre-registration and are thrilled to have you on board. Your application is under review, and we’re just as excited as you are to get things moving!',
            f'Stay tuned for updates, and in the meantime, feel free to check out more details on our social media channels or reach out at {event.email} with any questions. We’re here to help!',
        ]

        salutation = f'Good day {preregistration.firstName},'
        regards = ['Best,']

        # Check if email is a special sender to add to the regards message
        if special_sender := self.__sender_name_map.get(event.email):
            regards.append(special_sender)

        email_in = EmailIn(
            to=[preregistration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.PREREGISTRATION_EMAIL.value,
            eventId=event.eventId,
            isSparcs=is_sparcs,
        )
        logger.info(f'Sending pre-registration email to {preregistration.email}')
        return self.send_email(email_in=email_in, event=event)

    def send_preregistration_acceptance_email(self, preregistration: PreRegistration, event: Event) -> EmailIn:
        """Send an acceptance email to the queue.

        :param preregistration: The preregistration to be sent
        :type preregistration: PreRegistration

        :param event: The event to be sent
        :type event: Event

        :return: EmailIn
        """
        self.__event_email = event.email
        is_special_email = event.email in [email.value for email in SpecialEmails]
        is_sparcs = not is_special_email
        subject = f'You’re In! {event.name} Pre-Registration Accepted 🌟'
        salutation = f'Good day {preregistration.firstName},'
        body = [
            f'Congratulations! We are over the moon to let you know that your pre-registration for {event.name} has been accepted! This is going to be an extraordinary experience, and we can’t wait to share it with you.',
            f'To complete your registration and secure your spot, please follow this link: https://techtix.app/{event.eventId}/register',
            f'If you have any questions or need assistance, reach out to us at {event.email}. Let’s make this event unforgettable!',
        ]
        regards = ['Best,']

        # Check if email is a special sender to add to the regards message
        if special_sender := self.__sender_name_map.get(event.email):
            regards.append(special_sender)

        email_in = EmailIn(
            to=[preregistration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.PREREGISTRATION_EMAIL.value,
            eventId=event.eventId,
            isSparcs=is_sparcs,
        )
        logger.info(f'Sending pre-registration acceptance email to {preregistration.email}')
        return email_in

    def send_preregistration_rejection_email(self, preregistration: PreRegistration, event: Event) -> EmailIn:
        """Send a rejection email to the queue.

        :param preregistration: The preregistration to be sent
        :type preregistration: PreRegistration

        :param event: The event to be sent
        :type event: Event

        :return: EmailIn

        """
        self.__event_email = event.email
        is_special_email = event.email in [email.value for email in SpecialEmails]
        is_sparcs = not is_special_email
        subject = f'Regretful News Regarding Your Pre-Registration for {event.name}'
        body = [
            f'We hope this message finds you well. It is with genuine regret that we inform you that your pre-registration for the upcoming {event.name} has been declined.',
            'We understand the disappointment and frustration this may cause, and for that, we sincerely apologize. Please know that our decision was made after careful consideration and was not taken lightly.',
            'Despite this setback, we want to extend a heartfelt invitation to you for our next event. We believe that your enthusiasm and passion would greatly contribute to the vibrant atmosphere of our community, and we would be honored to have you join us.',
            f'We value your support and understanding, and we genuinely hope to welcome you to our future events. Should you have any questions or require further assistance, please do not hesitate to reach out to us at {event.email}.',
            'Thank you for your understanding.',
        ]
        salutation = f'Good day {preregistration.firstName},'
        regards = ['Best,']

        # Check if email is a special sender to add to the regards message
        if special_sender := self.__sender_name_map.get(event.email):
            regards.append(special_sender)

        email_in = EmailIn(
            to=[preregistration.email],
            subject=subject,
            body=body,
            salutation=salutation,
            regards=regards,
            emailType=EmailType.PREREGISTRATION_EMAIL.value,
            eventId=event.eventId,
            isSparcs=is_sparcs,
        )
        logger.info(f'Sending pre-registration rejection email to {preregistration.email}')
        return email_in

    def send_event_completion_email(
        self,
        event: Event,
        claim_certificate_url: str,
        participants: list,
    ) -> Tuple[HTTPStatus, str]:
        """Send an email to the queue.

        :param event: Event entry
        :type event: Event

        :param claim_certificate_url: The url to claim the certificate
        :type claim_certificate_url: str

        :param participants: The participants to be sent
        :type participants: list

        """
        self.__event_email = event.email
        event_name = event.name
        event_id = event.eventId
        is_special_email = event.email in [email.value for email in SpecialEmails]
        is_sparcs = not is_special_email
        subject = f'Thank you for joining {event_name}. Claim your certificate now!'
        salutation = 'Good day,'
        body = [
            f'A big thank you for attending {event_name}! Your participation made the event truly special.',
            'To claim your certificate, please fill out the evaluation form below. Your feedback is crucial for us to keep improving.',
            claim_certificate_url,
            f'If you have any questions or need assistance, reach out to us at {event.email}.',
            "We're excited to see you at future events – more great experiences await!",
        ]
        regards = ['Best,']

        # Check if email is a special sender to add to the regards message
        if special_sender := self.__sender_name_map.get(event.email):
            regards.append(special_sender)

        emails = [
            EmailIn(
                to=[participant],
                subject=subject,
                body=body,
                salutation=salutation,
                regards=regards,
                emailType=EmailType.EVALUATION_EMAIL.value,
                eventId=event_id,
                isSparcs=is_sparcs,
            )
            for participant in participants
        ]

        return self.send_batch_email(email_in_list=emails, event=Event)
