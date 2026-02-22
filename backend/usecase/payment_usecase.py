import os
from http import HTTPStatus

from model.email.email import EmailIn, EmailType
from model.payments.payments import (
    PaymentTransactionIn,
    PaymentTransactionOut,
    TransactionStatus,
)
from model.pycon_registrations.pycon_registration import (
    PaymentRegistrationDetailsOut,
    PyconRegistrationIn,
    TicketTypes,
    TShirtSize,
    TShirtType,
)
from pydantic import ValidationError
from repository.events_repository import EventsRepository
from repository.payment_transaction_repository import PaymentTransactionRepository
from starlette.responses import JSONResponse
from usecase.email_usecase import EmailUsecase
from usecase.pycon_registration_usecase import PyconRegistrationUsecase
from utils.logger import logger


class PaymentUsecase:
    def __init__(self):
        self.payment_repo = PaymentTransactionRepository()
        self.events_repo = EventsRepository()
        self.pycon_registration_usecase = PyconRegistrationUsecase()
        self.email_usecase = EmailUsecase()

    def create_payment_transaction(self, payment_transaction: PaymentTransactionIn) -> PaymentTransactionOut:
        """
        Create a new payment transaction

        Arguments:
            payment_transaction -- The payment transaction data

        Returns:
            PaymentTransactionOut -- The created payment transaction
        """
        logger.info(f'Creating payment transaction for {payment_transaction.eventId}')
        logger.info(f'Payment transaction data: {payment_transaction}')
        status, payment_transaction, message = self.payment_repo.store_payment_transaction(payment_transaction)
        if status != HTTPStatus.OK:
            logger.error(f'[{payment_transaction.eventId}] {message}')
            return JSONResponse(status_code=status, content={'message': message})

        logger.info(f'Payment transaction created for {payment_transaction.eventId}')
        payment_transaction_dict = self.__convert_data_entry_to_dict(payment_transaction)
        return PaymentTransactionOut(**payment_transaction_dict)

    def update_payment_transaction(
        self, payment_transaction_id: str, payment_transaction_in: PaymentTransactionIn
    ) -> PaymentTransactionOut:
        """
        Update the payment transaction with the existing object

        Arguments:
            payment_transaction_id -- The ID of the payment transaction
            payment_transaction_in -- The payment transaction data

        Returns:
            PaymentTransactionOut -- The updated payment transaction
        """
        logger.info(f'Updating payment transaction for {payment_transaction_id}')
        status, existing_payment_transaction, message = self.payment_repo.query_payment_transaction_by_id_only(
            payment_transaction_id=payment_transaction_id
        )

        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        # Now update the payment transaction with the existing object
        status, updated_payment_transaction, message = self.payment_repo.update_payment_transaction(
            existing_payment_transaction, payment_transaction_in
        )
        if status != HTTPStatus.OK:
            logger.error(f'[{payment_transaction_id}] {message}')
            return JSONResponse(status_code=status, content={'message': message})

        logger.info(f'Payment transaction updated for {payment_transaction_id}')
        payment_transaction_dict = self.__convert_data_entry_to_dict(updated_payment_transaction)
        return PaymentTransactionOut(**payment_transaction_dict)

    def query_pending_payment_transactions(self) -> list[PaymentTransactionOut]:
        """
        Query all pending payment transactions

        Returns:
            list[PaymentTransactionOut] -- The list of payment transactions
        """
        status, payment_transactions, message = self.payment_repo.query_pending_payment_transactions()
        if status != HTTPStatus.OK:
            logger.error(f'[{message}]')
            return JSONResponse(status_code=status, content={'message': message})

        payment_transaction_list = []
        for payment_transaction in payment_transactions:
            payment_transaction_data = self.__convert_data_entry_to_dict(payment_transaction)

            try:
                pycon_registration_out = PaymentRegistrationDetailsOut(**payment_transaction_data)
                payment_transaction_out = PaymentTransactionOut(
                    **payment_transaction_data, registrationData=pycon_registration_out
                )

            except ValidationError as e:
                logger.error(f'[{payment_transaction.rangeKey}] {e}, skipping this payment transaction')
                continue

            payment_transaction_list.append(payment_transaction_out)

        return payment_transaction_list

    def payment_callback(self, payment_transaction_id: str, event_id: str):
        """
        Update the payment transaction status to SUCCESS and redirect to the success page

        Arguments:
            payment_transaction_id -- The ID of the payment transaction
            event_id -- The ID of the event

        Returns:
            JSONResponse -- The response to the client
        """
        logger.info(
            f'Processing payment callback for payment transaction id: {payment_transaction_id} and event id: {event_id}'
        )

        frontend_base_url = os.getenv('FRONTEND_URL')

        status, payment_transaction, message = self.payment_repo.query_payment_transaction_with_payment_transaction_id(
            payment_transaction_id=payment_transaction_id, event_id=event_id
        )
        if status != HTTPStatus.OK:
            logger.error(f'[{payment_transaction_id}] {message}')
            return JSONResponse(status_code=status, content={'message': message})

        registration_data = self._extract_registration_data_from_payment_transaction(
            payment_transaction, payment_transaction_id
        )
        if not registration_data:
            logger.error(f'[{payment_transaction_id}] Failed to extract registration data from payment transaction')
            self._send_payment_failed_email(payment_transaction, payment_transaction_id, event_id)
            error_redirect_url = (
                f'{frontend_base_url}/{event_id}/register?step=Error&paymentTransactionId={payment_transaction_id}'
            )
            return JSONResponse(
                status_code=302,
                headers={'Location': error_redirect_url},
                content={'message': 'Redirecting to error page'},
            )

        registration_result = self.pycon_registration_usecase.create_pycon_registration(registration_data)
        if isinstance(registration_result, JSONResponse):
            logger.error(f'[{payment_transaction_id}] Failed to create registration: {registration_result}')
            self._send_payment_failed_email(payment_transaction, payment_transaction_id, event_id)
            error_redirect_url = (
                f'{frontend_base_url}/{event_id}/register?step=Error&paymentTransactionId={payment_transaction_id}'
            )
            return JSONResponse(
                status_code=302,
                headers={'Location': error_redirect_url},
                content={'message': 'Redirecting to error page'},
            )

        success_payment_transaction_in = PaymentTransactionIn(
            transactionStatus=TransactionStatus.SUCCESS, eventId=event_id
        )
        status, payment_transaction, message = self.payment_repo.update_payment_transaction(
            payment_transaction=payment_transaction, payment_transaction_in=success_payment_transaction_in
        )
        if status != HTTPStatus.OK:
            logger.error(f'[{payment_transaction_id}] {message}')
            error_redirect_url = (
                f'{frontend_base_url}/{event_id}/register?step=Error&paymentTransactionId={payment_transaction_id}'
            )
            return JSONResponse(
                status_code=302,
                headers={'Location': error_redirect_url},
                content={'message': 'Redirecting to error page'},
            )

        logger.info(f'Payment transaction updated for {payment_transaction_id}')

        redirect_url = (
            f'{frontend_base_url}/{event_id}/register?step=Success&paymentTransactionId={payment_transaction_id}'
        )
        return JSONResponse(
            status_code=302, headers={'Location': redirect_url}, content={'message': 'Redirecting to success page'}
        )

    def _extract_registration_data_from_payment_transaction(
        self, payment_transaction, payment_transaction_id: str
    ) -> PyconRegistrationIn:
        """
        Extract registration data from payment transaction and create PyconRegistrationIn object

        Arguments:
            payment_transaction -- The payment transaction containing registration data
            payment_transaction_id -- The ID of the payment transaction for logging

        Returns:
            PyconRegistrationIn -- The registration data object or None if data is incomplete
        """
        try:
            # Convert enum string values back to enum types
            ticket_type = (
                TicketTypes(payment_transaction.ticketType) if payment_transaction.ticketType else TicketTypes.CODER
            )
            shirt_type = TShirtType(payment_transaction.shirtType) if payment_transaction.shirtType else None
            shirt_size = TShirtSize(payment_transaction.shirtSize) if payment_transaction.shirtSize else None

        except ValueError as e:
            logger.error(f'[{payment_transaction_id}] Invalid enum value in payment transaction: {e}')
            return None

        try:
            registration_data = PyconRegistrationIn(
                firstName=payment_transaction.firstName,
                lastName=payment_transaction.lastName,
                nickname=payment_transaction.nickname,
                pronouns=payment_transaction.pronouns,
                email=payment_transaction.email,
                eventId=payment_transaction.eventId,
                contactNumber=payment_transaction.contactNumber,
                organization=payment_transaction.organization,
                jobTitle=payment_transaction.jobTitle,
                facebookLink=payment_transaction.facebookLink,
                linkedInLink=payment_transaction.linkedInLink,
                ticketType=ticket_type,
                sprintDay=payment_transaction.sprintDay or False,
                availTShirt=payment_transaction.availTShirt or False,
                shirtType=shirt_type,
                shirtSize=shirt_size,
                communityInvolvement=payment_transaction.communityInvolvement or False,
                futureVolunteer=payment_transaction.futureVolunteer or False,
                dietaryRestrictions=payment_transaction.dietaryRestrictions,
                accessibilityNeeds=payment_transaction.accessibilityNeeds,
                discountCode=payment_transaction.discountCode,
                validIdObjectKey=payment_transaction.validIdObjectKey,
                amountPaid=payment_transaction.price,
                transactionId=payment_transaction_id,
            )

            logger.info(f'[{payment_transaction_id}] Successfully extracted registration data')
            return registration_data

        except ValidationError as e:
            logger.error(f'[{payment_transaction_id}] Validation error creating PyconRegistrationIn: {e}')
            return None

        except AttributeError as e:
            logger.error(f'[{payment_transaction_id}] Missing required attribute in payment transaction: {e}')
            return None

        except TypeError as e:
            logger.error(f'[{payment_transaction_id}] Type error in payment transaction data: {e}')
            return None

    def _send_payment_failed_email(self, payment_transaction, payment_transaction_id: str, event_id: str):
        """
        Send a payment failed email notification to the user

        Arguments:
            payment_transaction -- The payment transaction object
            payment_transaction_id -- The ID of the payment transaction
            event_id -- The ID of the event
        """
        try:
            # Get event details
            _, event_detail, _ = self.events_repo.query_events(event_id)
            if not event_detail:
                logger.error(f'[{payment_transaction_id}] Event details not found for eventId: {event_id}')
                return

            # Extract email details from payment transaction
            first_name = getattr(payment_transaction, 'firstName', 'User')
            email = getattr(payment_transaction, 'email', None)

            if not email:
                logger.error(f'[{payment_transaction_id}] No email found in payment transaction')
                return

            # Check if this is a PyCon event
            is_pycon_event = 'pycon' in event_detail.name.lower() if event_detail.name else False

            # Create email body similar to payment_tracking_usecase
            def _create_failed_body(event_name: str, transaction_id: str) -> list[str]:
                return [
                    f'There was an issue processing your registration for {event_name}. Your payment may have been successful, but we encountered a problem creating your registration.',
                    f'Please contact our support team at durianpy.davao@gmail.com and present your transaction ID: {transaction_id}',
                    'We will resolve this issue and ensure your registration is completed.',
                ]

            # Determine email subject based on event type
            if is_pycon_event:
                subject = 'Issue with your PyCon Davao 2025 Registration'
            else:
                subject = f'Issue with your {event_detail.name} Registration'

            email_in = EmailIn(
                to=[email],
                subject=subject,
                salutation=f'Hi {first_name},',
                body=_create_failed_body(event_detail.name, payment_transaction_id),
                regards=['Sincerely,'],
                emailType=EmailType.REGISTRATION_EMAIL,
                eventId=event_id,
                isDurianPy=is_pycon_event,
            )

            self.email_usecase.send_email(email_in=email_in, event=event_detail)
            logger.info(f'[{payment_transaction_id}] Payment failed email sent to {email}')

        except Exception as e:
            logger.error(f'[{payment_transaction_id}] Failed to send payment failed email: {e}')

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        """Convert a data entry to a dictionary

        :param data_entry: The data entry to be converted
        :type data_entry: Any

        :return: The dictionary representation of the data entry
        :rtype: dict

        """
        return data_entry.to_simple_dict()
