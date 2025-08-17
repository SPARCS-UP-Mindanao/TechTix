import os
from copy import deepcopy
from datetime import datetime
from http import HTTPStatus
from typing import List, Tuple

import pytz
from constants.common_constants import EntryStatus
from model.payments.payments import (
    PaymentTransaction,
    PaymentTransactionIn,
    TransactionStatus,
)
from pynamodb.connection import Connection
from pynamodb.exceptions import (
    PutError,
    PynamoDBConnectionError,
    QueryError,
    ScanError,
    TableDoesNotExist,
    TransactWriteError,
)
from pynamodb.transactions import TransactWrite
from repository.repository_utils import RepositoryUtils
from ulid import ulid
from utils.logger import logger


class PaymentTransactionRepository:
    def __init__(self):
        self.core_obj = 'PaymentTransaction'
        self.current_date = datetime.now(tz=pytz.timezone('Asia/Manila')).isoformat()
        self.latest_version = 0
        self.conn = Connection(region=os.getenv('REGION'))

    def store_payment_transaction(
        self, payment_transaction_in: PaymentTransactionIn
    ) -> Tuple[HTTPStatus, PaymentTransaction, str]:
        """Store a new payment_transaction.

        :param payment_transaction_in: The payment_transaction data to store.
        :type payment_transaction_in: PaymentTransactionIn

        :return: The HTTP status, the stored payment_transaction or None, and a message.
        :rtype: Tuple[HTTPStatus, PaymentTransaction, str]

        """
        data = RepositoryUtils.load_data(pydantic_schema_in=payment_transaction_in)
        event_id = payment_transaction_in.eventId
        entry_id = ulid()
        hash_key = f'{self.core_obj}#{event_id}'
        range_key = f'v{self.latest_version}#{entry_id}'
        try:
            payment_transaction_entry = PaymentTransaction(
                hashKey=hash_key,
                rangeKey=range_key,
                createDate=self.current_date,
                updateDate=self.current_date,
                createdBy=os.getenv('CURRENT_USER'),
                updatedBy=os.getenv('CURRENT_USER'),
                latestVersion=self.latest_version,
                entryStatus=EntryStatus.ACTIVE.value,
                entryId=entry_id,
                **data,
            )
            payment_transaction_entry.save()

        except PutError as e:
            message = f'Failed to save payment_transaction form: {str(e)}'
            logger.error(f'[{self.core_obj} = {entry_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj} = {entry_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj} = {entry_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj} = {entry_id}]: Save PaymentTransaction data successful')
            return HTTPStatus.OK, payment_transaction_entry, None

    def query_payment_transactions(self, event_id: str) -> Tuple[HTTPStatus, List[PaymentTransaction], str]:
        """Query ticket_types by event.

        :param event_id: The ID of the event to query payment_transactions for.
        :type event_id: str

        :return: The HTTP status, the queried payment_transactions or None, and a message.
        :rtype: Tuple[HTTPStatus, List[PaymentTransaction], str]

        """
        try:
            hash_key = f'{self.core_obj}#{event_id}'
            range_key_prefix = f'v{self.latest_version}#'
            range_key_condition = PaymentTransaction.rangeKey.startswith(range_key_prefix)

            payment_transaction_entries = list(
                PaymentTransaction.query(
                    hash_key=hash_key,
                    range_key_condition=range_key_condition,
                    filter_condition=PaymentTransaction.entryStatus == EntryStatus.ACTIVE.value,
                )
            )

            if not payment_transaction_entries:
                message = 'No payment_transactions found'
                logger.error(f'[{self.core_obj}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query payment_transaction: {str(e)}'
            logger.error(f'[{self.core_obj} = {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj} = {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj} = {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj} = Fetch PaymentTransaction data successful')
            return HTTPStatus.OK, payment_transaction_entries, None

    def query_payment_transaction_with_payment_transaction_id(
        self, event_id: str, payment_transaction_id: str
    ) -> Tuple[HTTPStatus, PaymentTransaction, str]:
        """Query payment_transactions by payment_transaction ID.

        :param event_id: The ID of the event to query payment_transactions for.
        :type event_id: str

        :param payment_transaction_id: The ID of the payment_transaction to query, defaults to None.
        :type payment_transaction_id: str

        :return: The HTTP status, the queried payment_transactions or None, and a message.
        :rtype: Tuple[HTTPStatus, PaymentTransaction, str]

        """
        try:
            hash_key = f'{self.core_obj}#{event_id}'
            range_key_prefix = f'v{self.latest_version}#{payment_transaction_id}'
            range_key_condition = PaymentTransaction.rangeKey.__eq__(range_key_prefix)

            payment_transaction_entries = list(
                PaymentTransaction.query(
                    hash_key=hash_key,
                    range_key_condition=range_key_condition,
                    filter_condition=PaymentTransaction.entryStatus == EntryStatus.ACTIVE.value,
                )
            )

            if not payment_transaction_entries:
                message = f'PaymentTransaction with ID = {payment_transaction_id} not found'
                logger.error(f'[{self.core_obj} = {payment_transaction_id}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query payment_transaction: {str(e)}'
            logger.error(f'[{self.core_obj}={payment_transaction_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj}={payment_transaction_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj}={payment_transaction_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj}={payment_transaction_id}] Fetch PaymentTransaction data successful')
            return HTTPStatus.OK, payment_transaction_entries[0], None

    def update_payment_transaction(
        self, payment_transaction: PaymentTransaction, payment_transaction_in: PaymentTransactionIn
    ) -> Tuple[HTTPStatus, PaymentTransaction, str]:
        """Update a payment_transaction.

        :param payment_transaction: The payment_transaction to update.
        :type payment_transaction: PaymentTransaction

        :param payment_transaction_in: The payment_transaction data to update.
        :type payment_transaction_in: PaymentTransactionIn

        :return: The HTTP status, the updated payment_transaction or None, and a message.
        :rtype: Tuple[HTTPStatus, PaymentTransaction, str]

        """
        current_version = payment_transaction.latestVersion
        new_version = current_version + 1

        data = RepositoryUtils.load_data(pydantic_schema_in=payment_transaction_in, exclude_unset=True)
        has_update, updated_data = RepositoryUtils.get_update(
            old_data=RepositoryUtils.db_model_to_dict(payment_transaction), new_data=data
        )
        if not has_update:
            return HTTPStatus.OK, payment_transaction, 'no update'
        try:
            with TransactWrite(connection=self.conn) as transaction:
                # Update Entry -----------------------------------------------------------------------------
                # check if there's update or none
                updated_data.update(
                    updateDate=self.current_date,
                    updatedBy=os.getenv('CURRENT_USER'),
                    latestVersion=new_version,
                )
                actions = [getattr(PaymentTransaction, k).set(v) for k, v in updated_data.items()]
                transaction.update(payment_transaction, actions=actions)

                # Store Old Entry --------------------------------------------------------------------------
                old_payment_transaction = deepcopy(payment_transaction)
                old_payment_transaction.rangeKey = payment_transaction.rangeKey.replace('v0#', f'v{new_version}#')
                old_payment_transaction.latestVersion = current_version
                old_payment_transaction.updatedBy = old_payment_transaction.updatedBy or os.getenv('CURRENT_USER')
                transaction.save(old_payment_transaction)

            payment_transaction.refresh()
            logger.info(f'[{payment_transaction.rangeKey}] Update payment_transaction data successful')
            return HTTPStatus.OK, payment_transaction, ''

        except TransactWriteError as e:
            message = f'Failed to update payment_transaction data: {str(e)}'
            logger.error(f'[{payment_transaction.rangeKey}] {message}')

            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

    def query_pending_payment_transactions(self) -> Tuple[HTTPStatus, List[PaymentTransaction], str]:
        """Scan for PENDING payment_transactions across all events.


        :return: The HTTP status, the queried payment_transactions or None, and a message.
        :rtype: Tuple[HTTPStatus, List[PaymentTransaction], str]

        """
        try:
            # Use scan with filters instead of query
            range_key_prefix = f'v{self.latest_version}#'

            filter_condition = PaymentTransaction.transactionStatus == TransactionStatus.PENDING.value
            filter_condition &= PaymentTransaction.entryStatus == EntryStatus.ACTIVE.value
            filter_condition &= PaymentTransaction.rangeKey.startswith(range_key_prefix)

            payment_transaction_entries = list(
                PaymentTransaction.scan(
                    filter_condition=filter_condition,
                )
            )

            if not payment_transaction_entries:
                message = 'No pending payment_transactions found'
                logger.info(f'[{self.core_obj}] {message}')
                return HTTPStatus.NOT_FOUND, [], message

        except ScanError as e:
            message = f'Failed to scan payment_transactions: {str(e)}'
            logger.error(f'[{self.core_obj}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        else:
            logger.info(f'[{self.core_obj}] Fetch PaymentTransaction data successful')
            return HTTPStatus.OK, payment_transaction_entries, None
