import os
from http import HTTPStatus

from model.payments.payments import (
    PaymentTransactionIn,
    PaymentTransactionOut,
    TransactionStatus,
)
from model.pycon_registrations.pycon_registration import PaymentRegistrationDetailsOut
from pydantic import ValidationError
from repository.events_repository import EventsRepository
from repository.payment_transaction_repository import PaymentTransactionRepository
from starlette.responses import JSONResponse
from utils.logger import logger


class PaymentUsecase:
    def __init__(self):
        self.payment_repo = PaymentTransactionRepository()
        self.events_repo = EventsRepository()

    def create_payment_transaction(self, payment_transaction: PaymentTransactionIn) -> PaymentTransactionOut:
        """
        Create a new payment transaction

        Arguments:
            payment_transaction -- The payment transaction data

        Returns:
            PaymentTransactionOut -- The created payment transaction
        """
        logger.info(f'Creating payment transaction for {payment_transaction.eventId}')
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
        status, payment_transaction, message = self.payment_repo.query_payment_transaction_with_payment_transaction_id(
            payment_transaction_id=payment_transaction_id, event_id=event_id
        )
        if status != HTTPStatus.OK:
            logger.error(f'[{payment_transaction_id}] {message}')
            return JSONResponse(status_code=status, content={'message': message})

        success_payment_transaction_in = PaymentTransactionIn(
            transactionStatus=TransactionStatus.SUCCESS, eventId=event_id
        )
        status, payment_transaction, message = self.payment_repo.update_payment_transaction(
            payment_transaction=payment_transaction, payment_transaction_in=success_payment_transaction_in
        )
        if status != HTTPStatus.OK:
            logger.error(f'[{payment_transaction_id}] {message}')
            return JSONResponse(status_code=status, content={'message': message})

        logger.info(f'Payment transaction updated for {payment_transaction_id}')
        frontend_base_url = os.getenv('FRONTEND_URL')
        redirect_url = (
            f'{frontend_base_url}/{event_id}/register?step=Success&paymentTransactionId={payment_transaction_id}'
        )
        return JSONResponse(
            status_code=302, headers={'Location': redirect_url}, content={'message': 'Redirecting to success page'}
        )

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        """Convert a data entry to a dictionary

        :param data_entry: The data entry to be converted
        :type data_entry: Any

        :return: The dictionary representation of the data entry
        :rtype: dict

        """
        return data_entry.to_simple_dict()
