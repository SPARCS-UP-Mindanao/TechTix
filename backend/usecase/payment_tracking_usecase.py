from datetime import datetime, timezone
from http import HTTPStatus

import ulid
from model.email.email import EmailIn, EmailType
from model.payments.payments import PaymentTrackingBody, TransactionStatus
from model.events.event import Event
from model.pycon_registrations.pycon_registration import (
    PyconRegistrationIn,
    PyconRegistrationOut,
)
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
            self._update_timestamps(message_body)
            payment_tracking_body = PaymentTrackingBody(**message_body)

            registration_details = payment_tracking_body.registration_details
            transaction_status = payment_tracking_body.status
            registration_data = registration_details.registrationData
            event_id = registration_details.eventId
            entry_id = registration_details.entryId

            if transaction_status == TransactionStatus.PENDING:
                logger.info(f'Skipping PENDING message for entryId: {entry_id}')
                return

            _, event_detail, _ = self.event_repository.query_events(event_id)
            if not event_detail:
                raise ValueError(f"Event details not found for eventId: {event_id}")

            # Update Payment Transaction Status
            status, _, msg = self.payment_transaction_repository.update_payment_transaction_status(
                event_id=event_id,
                payment_transaction_id=entry_id,
                status=transaction_status
            )

            if status != HTTPStatus.OK:
                logger.error(f"Failed to update payment transaction status for entryId {entry_id}: {msg}")
                return

            logger.info(f'Payment transaction status updated to {transaction_status} for entryId {entry_id}')

            self._create_and_save_registration(registration_details, registration_data, transaction_status)

            self._send_email_notification(
                registration_data=registration_data,
                status=transaction_status,
                event_detail=event_detail,
            )
            logger.info(f'Successfully processed and saved registration for {registration_data.email}')

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

    def _create_and_save_registration(self, registration_details, registration_data, status):
        registration_id = str(ulid.ulid())
        current_date = datetime.now(timezone.utc).isoformat()

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
            amountPaid=registration_details.amountPaid,
            transactionId=registration_details.entryId,
            paymentId=registration_details.paymentId,
            referenceNumber=registration_details.referenceNumber,
            gcashPayment=registration_details.gcashPayment,
            registrationEmailSent=True,
            confirmationEmailSent=True,
            eventId=registration_details.eventId,
            entryStatus=status.value,
        )

        self.registration_repository.store_registration(
            registration_in=registration_in, registration_id=registration_id
        )

    def _send_email_notification(self, registration_data: PyconRegistrationOut, status: str, event_detail: Event):
        email_templates = {
            TransactionStatus.SUCCESS: {
                "subject": f"You're all set for {event_detail.name}!",
                "body": [
                    f"Hi {registration_data.firstName},",
                    f"Thank you for registering for {event_detail.name}! Your payment was successful, and we're excited to see you at the event.",
                    f"Below is a summary of your registration details:",
                    f"Ticket Type: {registration_data.ticketType.value.capitalize()}",
                    f"Sprint Day Participation: {'Yes' if registration_data.sprintDay else 'No'}",
                    f"Amount Paid: ₱{registration_data.amountPaid:.2f}",
                    f"Transaction ID: {registration_data.transactionId}",
                    "",
                    "See you there!",
                ],
                "regards": ["Best,"],
            },
            TransactionStatus.FAILED: {
                "subject": f"Issue with your {event_detail.name} Payment",
                "body": [
                    f"Hi {registration_data.firstName},",
                    f"There was an issue processing your payment for {event_detail.name}. Please check your payment details or try again.",
                    f"If the problem persists, please contact our support team at durianpy.davao@gmail.com.",
                ],
                "regards": ["Sincerely,"],
            }
        }

        template = email_templates.get(status)

        if template:
            email_in = EmailIn(
                to=[registration_data.email],
                subject=template["subject"],
                body=template["body"],
                regards=template["regards"],
                emailType=EmailType.REGISTRATION_EMAIL,
                eventId=event_detail.eventId,
                isDurianPy=True,
            )
            self.email_usecase.send_email(email_in=email_in, event=event_detail)
        else:
            logger.error(f"No email template found for status: {status}")