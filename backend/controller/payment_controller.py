from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from model.common import Message
from model.payments.payments import PaymentTransactionIn, PaymentTransactionOut
from usecase.payment_usecase import PaymentUsecase

payment_router = APIRouter()


@payment_router.post(
    '',
    response_model=PaymentTransactionOut,
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


@payment_router.get(
    '/pending',
    response_model=list[PaymentTransactionOut],
    responses={
        404: {'model': Message, 'description': 'Bad request'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get pending payment transactions',
)
def get_pending_payment_transactions(
    event_id: str = Query(..., description='Get Payment Transactions with PENDING Status', alias='eventId'),
):
    """
    Get Payment Transaction with pending Status
    """
    payment_uc = PaymentUsecase()
    return payment_uc.query_pending_payment_transactions(event_id=event_id)


@payment_router.get(
    '/callback',
    status_code=302,
    response_class=JSONResponse,
    responses={
        302: {'description': 'Redirect'},
        400: {'model': Message, 'description': 'Bad request'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Payment callback',
)
async def payment_callback(
    payment_transaction_id: str = Query(
        ..., description='The ID of the payment transaction', alias='paymentTransactionId'
    ),
    event_id: str = Query(..., description='The ID of the event', alias='eventId'),
):
    """
    Handle payment callback and redirect.

    This endpoint is typically called by the payment provider after a payment is processed.
    It should handle the callback data and redirect the user to an appropriate page.

    :return: A redirect response.
    :rtype: JSONResponse
    """
    payment_uc = PaymentUsecase()
    return payment_uc.payment_callback(payment_transaction_id, event_id)
