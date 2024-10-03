import json
from http import HTTPStatus

from repository.payment_transaction_repository import PaymentTransactionRepository
from model.payments.payments import PaymentTransactionIn, PaymentTransactionOut
from starlette.responses import JSONResponse

class PaymentUsecase:
    def __init__(self):
        self.payment_repo = PaymentTransactionRepository()

    def create_payment_transaction(self, payment_transaction: PaymentTransactionIn) -> PaymentTransactionOut:
        status, payment_transaction, message = self.payment_repo.store_payment_transaction(payment_transaction)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        payment_transaction_dict = self.__convert_data_entry_to_dict(payment_transaction)
        return PaymentTransactionOut(**payment_transaction_dict)
    
    def update_payment_transaction(self, payment_transaction_id: str, payment_transaction_in: PaymentTransactionIn) -> PaymentTransactionOut:
        status, payment_transaction, message = self.payment_repo.query_payment_transaction_with_payment_transaction_id(
            event_id=payment_transaction_in.eventId,
            payment_transaction_id=payment_transaction_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, payment_transaction, message = self.payment_repo.update_payment_transaction(payment_transaction_id, payment_transaction_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        payment_transaction_dict = self.__convert_data_entry_to_dict(payment_transaction)
        return PaymentTransactionOut(**payment_transaction_dict)


    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        """Convert a data entry to a dictionary

        :param data_entry: The data entry to be converted
        :type data_entry: Any

        :return: The dictionary representation of the data entry
        :rtype: dict

        """
        return json.loads(data_entry.to_json())