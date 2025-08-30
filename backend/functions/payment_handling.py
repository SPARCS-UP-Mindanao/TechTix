import json
import os
from datetime import datetime, timezone

import boto3
from model.payments.payments import PaymentTrackingBody
from usecase.payment_tracking_usecase import PaymentTrackingUsecase
from utils.logger import logger

SQS = boto3.client('sqs')
PAYMENT_QUEUE = os.environ.get('PAYMENT_QUEUE')


def handler(event, context):
    _ = context
    payment_tracking_usecase = PaymentTrackingUsecase()

    for record in event.get('Records', []):
        receipt_handle = record.get('receiptHandle')
        try:
            message_body = json.loads(record['body'])
            if message_body and 'registration_details' in message_body:
                current_time = datetime.now(timezone.utc).isoformat()
                message_body['registration_details']['registrationData']['createDate'] = current_time
                message_body['registration_details']['registrationData']['updateDate'] = current_time
            payment_tracking_body = PaymentTrackingBody(**message_body)

            logger.info(f'Processing message for entryId: {payment_tracking_body.registration_details.entryId}')

            payment_tracking_usecase.process_payment_event(payment_tracking_body)

        except Exception as e:
            logger.error(f'Failed to process message with receipt handle {receipt_handle}: {e}')

        finally:
            if receipt_handle:
                SQS.delete_message(QueueUrl=PAYMENT_QUEUE, ReceiptHandle=receipt_handle)
                logger.info(f'SQS message with receipt handle {receipt_handle} deleted.')
