import os
from http import HTTPStatus

from model.payments.payments import (
    PaymentTransactionIn,
    PaymentTransactionOut,
    TransactionStatus,
)
from repository.events_repository import EventsRepository
from repository.payment_transaction_repository import PaymentTransactionRepository
from starlette.responses import JSONResponse


class PaymentUsecase:
    def __init__(self):
        self.payment_repo = PaymentTransactionRepository()
        self.events_repo = EventsRepository()

    def create_payment_transaction(self, payment_transaction: PaymentTransactionIn) -> PaymentTransactionOut:
        status, payment_transaction, message = self.payment_repo.store_payment_transaction(payment_transaction)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        payment_transaction_dict = self.__convert_data_entry_to_dict(payment_transaction)
        return PaymentTransactionOut(**payment_transaction_dict)

    def query_pending_payment_transactions(self) -> list[PaymentTransactionOut]:
        status, payment_transactions, message = self.payment_repo.query_pending_payment_transactions()
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        payment_transactions_out = [
            PaymentTransactionOut(**self.__convert_data_entry_to_dict(payment_transaction))
            for payment_transaction in payment_transactions
        ]
        return payment_transactions_out

    def payment_callback(self, payment_transaction_id: str, event_id: str):
        status, payment_transaction, message = self.payment_repo.query_payment_transaction_with_payment_transaction_id(
            payment_transaction_id=payment_transaction_id, event_id=event_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        success_payment_transaction_in = PaymentTransactionIn(
            transactionStatus=TransactionStatus.SUCCESS, eventId=event_id
        )
        status, payment_transaction, message = self.payment_repo.update_payment_transaction(
            payment_transaction=payment_transaction, payment_transaction_in=success_payment_transaction_in
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

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
