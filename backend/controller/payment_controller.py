
from fastapi import APIRouter
from model.common import Message
from usecase.payment_usecase import PaymentUsecase
from model.payments.payments import PaymentTransactionIn, PaymentTransactionOut

payment_router = APIRouter()

@payment_router.post(
    '',
    response_model=PaymentTransactionIn,
    responses={
        400: {'model': Message, 'description': 'Bad request'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Create payment transaction',
)
@payment_router.post(
    '/',
    response_model=PaymentTransactionOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def create_payment_transaction(
    payment_transaction: PaymentTransactionIn,
):
    """Create payment transaction

    :param payment_transaction: PaymentTransactionIn object containing the new payment transaction data.
    :type payment_transaction: PaymentTransactionIn

    :return: PaymentTransactionOut object.
    :rtype: PaymentTransactionOut

    """
    payment_uc = PaymentUsecase()
    return payment_uc.create_payment_transaction(payment_transaction)

