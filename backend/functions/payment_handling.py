from usecase.payment_tracking_sqs_usecase import PaymentTrackingSQSUsecase
from utils.logger import logger


def handler(event, context):
    """Lambda handler for processing payment tracking messages from an SQS queue.

    :param event: The event data, which includes the SQS payment tracking messages to be processed.
    :type event: dict

    :param context: The context in which the event occurred. This is not used in this function.
    :type context: object

    :raises Exception: If an error occurs during the processing of the payment message.
    """
    _ = context
    try:
        payment_sqs_usecase = PaymentTrackingSQSUsecase()
        payment_sqs_usecase.process_payment_message(event)
        logger.info('Finished processing all records in the event.')
    except Exception as e:
        logger.error(f'An error occurred in the handler: {e}')
