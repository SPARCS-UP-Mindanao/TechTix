from model.entities import Entities
from model.payments.payments import TransactionStatus
from utils import logger


class PaymentTrackingRepository:
    def update_payment_transaction(self, event_id: str, entry_id: str, status: TransactionStatus):
        try:
            transaction_detail = Entities.get(hash_key=f'PaymentTransaction#-{event_id}', range_key=f'v0#{entry_id}')
            transaction_detail.update(
                actions=[
                    Entities.transactionStatus.set(status.value),
                ]
            )
        except Entities.DoesNotExist:
            logger.error(f'Payment transaction with entryId {entry_id} not found.')
            raise
