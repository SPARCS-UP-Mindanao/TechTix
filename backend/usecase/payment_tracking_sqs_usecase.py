import json
import os

import boto3
from usecase.payment_tracking_usecase import PaymentTrackingUsecase
from utils.logger import logger


class PaymentTrackingSQSUsecase:
    def __init__(self):
        self.SQS_CLIENT = boto3.client('sqs')
        self.PAYMENT_QUEUE = os.environ.get('PAYMENT_QUEUE')
        self.payment_tracking_usecase = PaymentTrackingUsecase()

    def process_payment_message(self, event):
        for record in event.get('Records', []):
            receipt_handle = record.get('receiptHandle')
            try:
                message_body = json.loads(record['body'])

                self.payment_tracking_usecase.process_payment_event(message_body)

            except Exception as e:
                logger.error(f'Failed to process message with receipt handle {receipt_handle}: {e}')

            finally:
                if receipt_handle:
                    self.SQS_CLIENT.delete_message(QueueUrl=self.PAYMENT_QUEUE, ReceiptHandle=receipt_handle)
                    logger.info(f'SQS message with receipt handle {receipt_handle} deleted.')
