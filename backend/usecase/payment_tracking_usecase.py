from datetime import datetime, timezone
from http import HTTPStatus
from typing import Optional

import ulid
from model.email.email import EmailIn, EmailType
from model.events.event import Event
from model.payments.payments import PaymentTrackingBody, TransactionStatus
from model.pycon_registrations.pycon_registration import PyconRegistrationIn
from model.registrations.registration import Registration
from repository.events_repository import EventsRepository
from repository.payment_transaction_repository import PaymentTransactionRepository
from repository.registrations_repository import RegistrationsRepository
from usecase.email_usecase import EmailUsecase
from utils.logger import logger


class PaymentTrackingUsecase:
    def __init__(self):
        self.registration_repository = RegistrationsRepository()
        self.email_usecase = EmailUsecase()
        self.event_repository = EventsRepository()
        self.payment_transaction_repository = PaymentTransactionRepository()

    def process_payment_event(self, message_body: dict) -> None:
        """
        Processes a payment event message, updates the payment transaction status,
        and stores the registration details.
        """
        try:
            logger.info(f'Processing payment event message: {message_body}')
            self._update_timestamps(message_body)
            payment_tracking_body = PaymentTrackingBody(**message_body)

            registration_details = payment_tracking_body.registration_details
            transaction_status = payment_tracking_body.status
            registration_data = registration_details.registrationData
            event_id = registration_details.eventId
            entry_id = registration_details.entryId
            recorded_registration_data = None

            if transaction_status == TransactionStatus.PENDING:
                logger.info(f'Skipping PENDING message for entryId: {entry_id}')
                return

            _, event_detail, _ = self.event_repository.query_events(event_id)
            if not event_detail:
                logger.error(f'Event details not found for eventId: {event_id}')
                raise ValueError(f'Event details not found for eventId: {event_id}')

            # Update Payment Transaction Status
            status, _, msg = self.payment_transaction_repository.update_payment_transaction_status(
                event_id=event_id, payment_transaction_id=entry_id, status=transaction_status
            )

            if status != HTTPStatus.OK:
                logger.error(f'Failed to update payment transaction status for entryId {entry_id}: {msg}')
                return

            logger.info(f'Payment transaction status updated to {transaction_status} for entryId {entry_id}')

            if transaction_status == TransactionStatus.SUCCESS:
                recorded_registration_data = self._create_and_save_registration(
                    payment_tracking_body=payment_tracking_body
                )
                if not recorded_registration_data:
                    logger.error(f'Failed to save registration for entryId {entry_id}')

            self._send_email_notification(
                first_name=registration_data.firstName,
                email=registration_data.email,
                transaction_id=entry_id,
                recorded_registration=recorded_registration_data,
                ticket_type=registration_data.ticketType.value,
                status=transaction_status,
                event_detail=event_detail,
            )
            logger.info(f'Successfully processed registration for {registration_data.email}')

        except Exception as e:
            logger.error(f'Failed to process successful payment for entryId {registration_details.entryId}: {e}')
            raise

    def _update_timestamps(self, message_body: dict):
        registration_details = message_body.get('registration_details')
        if registration_details and 'registrationData' in registration_details:
            current_time = datetime.now(timezone.utc).isoformat()
            registration_data = registration_details['registrationData']

            if 'createDate' not in registration_data:
                registration_data['createDate'] = current_time

            registration_data['updateDate'] = current_time

    def _create_and_save_registration(self, payment_tracking_body: PaymentTrackingBody):
        registration_id = str(ulid.ulid())
        current_date = datetime.now(timezone.utc).isoformat()
        registration_details = payment_tracking_body.registration_details
        registration_data = registration_details.registrationData

        registration_in = PyconRegistrationIn(
            hashKey=registration_data.eventId or registration_id,
            rangeKey=registration_details.entryId,
            registrationId=registration_id,
            createDate=current_date,
            updateDate=current_date,
            email=registration_data.email,
            firstName=registration_data.firstName,
            lastName=registration_data.lastName,
            nickname=registration_data.nickname,
            pronouns=registration_data.pronouns,
            facebookLink=registration_data.facebookLink if registration_data.facebookLink else None,
            linkedInLink=registration_data.linkedInLink if registration_data.linkedInLink else None,
            contactNumber=registration_data.contactNumber,
            organization=registration_data.organization,
            jobTitle=registration_data.jobTitle,
            ticketType=registration_data.ticketType.value,
            sprintDay=registration_data.sprintDay,
            availTShirt=registration_data.availTShirt,
            shirtType=registration_data.shirtType.value if registration_data.shirtType else None,
            shirtSize=registration_data.shirtSize.value if registration_data.shirtSize else None,
            communityInvolvement=registration_data.communityInvolvement,
            futureVolunteer=registration_data.futureVolunteer,
            dietaryRestrictions=registration_data.dietaryRestrictions,
            accessibilityNeeds=registration_data.accessibilityNeeds,
            discountCode=registration_data.discountCode,
            validIdObjectKey=registration_data.validIdObjectKey,
            amountPaid=registration_details.amountPaid or registration_details.price,
            transactionId=registration_details.entryId,
            paymentId=registration_details.paymentId,
            referenceNumber=registration_details.referenceNumber,
            gcashPayment=registration_details.gcashPayment,
            registrationEmailSent=True,
            confirmationEmailSent=True,
            eventId=registration_details.eventId,
            entryStatus=payment_tracking_body.status.value,
        )

        status, registration_data, _ = self.registration_repository.store_registration(
            registration_in=registration_in, registration_id=registration_id
        )

        logger.info(
            f'Registration stored with status: {status}, registrationId: {registration_id}, data: {registration_data}'
        )

        return registration_data

    def _send_email_notification(
        self,
        email: str,
        first_name: str,
        transaction_id: str,
        ticket_type: str,
        status: TransactionStatus,
        event_detail: Event,
        is_pycon_event: bool = True,
        recorded_registration: Optional[Registration] = None,
    ):
        """
        Sends an email notification based on the transaction status and event type.
        """
        if not event_detail:
            logger.error('Event details are missing. Cannot send email.')
            return

        def _email_list_elements(elements: list[str]) -> str:
            return '\n'.join([f'<li>{element}</li>' for element in elements])

        def _email_bold_element(element: str) -> str:
            return f'<b>{element}</b>'

        def _email_newline_element() -> str:
            return '<br/>'

        def _create_success_body(reg_data: Registration, ticket: str) -> list[str]:
            logger.info(f'Creating success email body for registration: {reg_data}')
            base_body = [
                f"Thank you for registering for {event_detail.name}! Your payment was successful, and we're excited to see you at the event.",
                _email_bold_element('Below is a summary of your registration details:'),
            ]

            list_items = [
                f'Registration ID: {reg_data.registrationId if reg_data.registrationId else "N/A"}',
                f'Ticket Type: {ticket.capitalize()}',
                f'Sprint Day Participation: {"Yes" if reg_data.sprintDay else "No"}',
                f'Amount Paid: ₱{reg_data.amountPaid:.2f}' if reg_data.amountPaid is not None else 'Amount Paid: ₱0',
                f'Transaction ID: {reg_data.transactionId if reg_data.transactionId else "N/A"}',
            ]

            if is_pycon_event:
                base_body[
                    0
                ] = "Thank you for registering for PyCon Davao 2025 by DurianPy! Your payment was successful, and we're excited to see you at the event."
                list_items.pop()

            base_body.append(_email_list_elements(list_items))
            base_body.append(_email_newline_element())
            base_body.append('See you there!')

            return base_body

        def _create_failed_body(name: str, transaction_id: str) -> list[str]:
            return [
                f'There was an issue processing your payment for {name}. Please check your payment details or try again.',
                f'If the problem persists, please contact our support team at durianpy.davao@gmail.com and present your transaction ID: {transaction_id}',
            ]

        templates = {
            TransactionStatus.SUCCESS: {
                'subject': f"You're all set for {event_detail.name}!",
                'salutation': f'Hi {first_name},',
                'body': lambda: _create_success_body(recorded_registration, ticket_type),
                'regards': ['Best,'],
            },
            TransactionStatus.FAILED: {
                'subject': f'Issue with your {event_detail.name} Payment',
                'salutation': f'Hi {first_name},',
                'body': lambda: _create_failed_body(event_detail.name, transaction_id),
                'regards': ['Sincerely,'],
            },
        }

        if is_pycon_event:
            templates[TransactionStatus.SUCCESS]['subject'] = "You're all set for PyCon Davao 2025!"
            templates[TransactionStatus.FAILED]['subject'] = 'Issue with your PyCon Davao 2025 Payment'

        template = templates.get(status)

        if not template:
            logger.error(f'No email template found for status: {status}')
            return

        logger.info(f'Preparing to send email for event {event_detail.eventId} with status {status} to {email}.')

        email_in = EmailIn(
            to=[email],
            subject=template['subject'],
            salutation=template['salutation'],
            body=template['body'](),
            regards=template['regards'],
            emailType=EmailType.REGISTRATION_EMAIL,
            eventId=event_detail.eventId,
            isDurianPy=is_pycon_event,
        )
        self.email_usecase.send_email(email_in=email_in, event=event_detail)
        logger.info(f'Email notification sent for event {event_detail.eventId} with status {status}.')
