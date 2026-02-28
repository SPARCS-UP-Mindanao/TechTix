from http import HTTPStatus

from constants.common_constants import EmailType
from fastapi.responses import JSONResponse
from model.email.email import EmailIn
from model.events.event import Event
from model.payments.payments import PaymentTransactionOut
from repository.events_repository import EventsRepository
from repository.registrations_repository import RegistrationsRepository
from usecase.email_usecase import EmailUsecase
from utils.logger import logger
from backend.utils.pii.pii_masking import mask_email


class PyConRegistrationEmailNotification:
    def __init__(self):
        self.__email_usecase = EmailUsecase()
        self.__registrations_repository = RegistrationsRepository()
        self.__events_repository = EventsRepository()

    def send_registration_success_email(self, email: str, event: Event, is_pycon_event: bool = True) -> None:
        logger.info(f'Preparing to send registration success email to {mask_email(email)} for event {event.name}')
        _, registration, _ = self.__registrations_repository.query_registrations_with_email(
            email=email, event_id=event.eventId
        )
        registration_data = registration[0] if registration else None

        if not registration:
            logger.error(f'No registration found for email: {mask_email(email)} and event_id: {event.eventId}')
            return

        body = [
            f"Thank you for registering for {event.name}! Your payment was successful, and we're excited to see you at the event."
            if not is_pycon_event
            else "Thank you for registering for PyCon Davao 2025 by DurianPy! Your payment was successful, and we're excited to see you at the event.",
            self.__email_bold_element('Below is a summary of your registration details:'),
            self.__email_list_elements(
                [
                    f'Registration ID: {registration_data.registrationId}',
                    f"Ticket Type: {str(registration_data.ticketType).capitalize() if registration_data.ticketType else 'N/A'}",
                    f"Sprint Day Participation: {'Yes' if registration_data.sprintDay else 'No'}",
                    f"Amount Paid: ₱{registration_data.amountPaid if registration_data.amountPaid else '0'}",
                    f"Transaction ID: {registration_data.transactionId if registration_data.transactionId else 'N/A'}",
                ]
            ),
            self.__email_newline_element(),
            'See you at the event!',
        ]

        email_in = EmailIn(
            to=[email],
            subject=f'Issue with your {event.name} Payment'
            if not is_pycon_event
            else 'Issue with your PyCon Davao 2025 Payment',
            salutation=f'Dear {registration_data.firstName},'
            if registration_data and registration_data.firstName
            else 'Dear Attendee,',
            body=body,
            regards=['Best,'],
            emailType=EmailType.REGISTRATION_EMAIL,
            eventId=str(event.eventId),
            isDurianPy=is_pycon_event,
        )
        self.__email_usecase.send_email(email_in=email_in, event=event)
        logger.info(f'Sent registration success email to {mask_email(email)} for event {event.name}')

    def send_registration_failure_email(
        self, email: str, event: Event, payment_transaction: PaymentTransactionOut, is_pycon_event: bool = True
    ) -> None:
        body = [
            f'There was an issue processing your payment for {event.name}. Please check your payment details or try again.',
            f'If the problem persists, please contact our support team at durianpy.davao@gmail.com and present your transaction ID: {payment_transaction.transactionId}.'
            if is_pycon_event
            else f'If the problem persists, please contact our support team at {event.email} and present your transaction ID: {payment_transaction.transactionId}.',
        ]

        email_in = EmailIn(
            to=[email],
            subject=f'Issue with your {event.name} Payment'
            if not is_pycon_event
            else 'Issue with your PyCon Davao 2025 Payment',
            salutation='Dear Attendee,'
            if not payment_transaction.registrationData
            else f'Dear {payment_transaction.registrationData.firstName},',
            body=body,
            regards=['Sincerely,'],
            emailType=EmailType.REGISTRATION_EMAIL,
            eventId=event.eventId,
            isDurianPy=is_pycon_event,
        )

        self.__email_usecase.send_email(email_in=email_in, event=event)
        logger.info(f'Sent registration failure email to {mask_email(email)} for event {event.name}')

    def resend_confirmation_email(self, event_id: str, email: str) -> JSONResponse:
        event_status, event_detail, event_message = self.__events_repository.query_events(event_id=event_id)
        if event_status != HTTPStatus.OK:
            return JSONResponse(status_code=event_status, content={'message': event_message})

        reg_status, registrations, reg_message = self.__registrations_repository.query_registrations_with_email(
            event_id=event_id, email=email
        )

        if reg_status != HTTPStatus.OK or not registrations or not registrations[0].transactionId:
            message = reg_message if reg_message else 'Registration not found or incomplete.'
            return JSONResponse(status_code=HTTPStatus.NOT_FOUND, content={'message': message})

        logger.info(f'Found registration for email {mask_email(email)} and event {event_detail.name}, resending confirmation email.')

        try:
            self.send_registration_success_email(email=email, event=event_detail, is_pycon_event=True)
            logger.info(f'Resent confirmation email to {mask_email(email)} for event {event_id}')
            return JSONResponse(status_code=HTTPStatus.OK, content={'message': f'Confirmation email sent to {mask_email(email)}'})
        except Exception as e:
            logger.error(f'Failed to resend confirmation email to {mask_email(email)}: {e}')
            return JSONResponse(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR, content={'message': 'Failed to send email.'}
            )

    def __email_list_elements(self, elements: list[str]) -> str:
        return '\n'.join([f'<li>{element}</li>' for element in elements])

    def __email_bold_element(self, element: str) -> str:
        return f'<b>{element}</b>'

    def __email_newline_element(self) -> str:
        return '<br/>'
