import os
from copy import deepcopy
from datetime import datetime
from http import HTTPStatus
from typing import List, Tuple

from constants.common_constants import EntryStatus
from model.discount.discount import Discount, DiscountDBIn
from pynamodb.connection import Connection
from pynamodb.exceptions import (
    PutError,
    PynamoDBConnectionError,
    QueryError,
    TableDoesNotExist,
    TransactWriteError,
)
from pynamodb.transactions import TransactWrite
from repository.repository_utils import RepositoryUtils
from utils.logger import logger


class DiscountsRepository:
    def __init__(self) -> None:
        self.core_obj = 'Discount'
        self.current_date = datetime.utcnow().isoformat()
        self.latest_version = 0
        self.conn = Connection(region=os.getenv('REGION'))

    def store_discount(self, discount_in: DiscountDBIn) -> Tuple[HTTPStatus, Discount, str]:
        """Store a new discount.

        :param discount_in: The discount data to store.
        :type discount_in: DiscountDBIn

        :return: The HTTP status, the stored discount or None, and a message.
        :rtype: Tuple[HTTPStatus, Discount, str]

        """
        data = RepositoryUtils.load_data(pydantic_schema_in=discount_in)
        entry_id = discount_in.entryId
        event_id = discount_in.eventId
        range_key = f'v{self.latest_version}#{event_id}#{entry_id}'
        try:
            discount_entry = Discount(
                hashKey=self.core_obj,
                rangeKey=range_key,
                createDate=self.current_date,
                updateDate=self.current_date,
                createdBy=os.getenv('CURRENT_USER'),
                updatedBy=os.getenv('CURRENT_USER'),
                latestVersion=self.latest_version,
                entryStatus=EntryStatus.ACTIVE.value,
                **data,
            )
            discount_entry.save()

        except PutError as e:
            message = f'Failed to save discount strategy form: {str(e)}'
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
            logger.info(f'[{self.core_obj} = {entry_id}]: Save Discounts strategy data successful')
            return HTTPStatus.OK, discount_entry, None

    def query_discounts(self, event_id: str) -> Tuple[HTTPStatus, List[Discount], str]:
        """Query discounts by event.

        :param event_id: The ID of the event to query discounts for.
        :type event_id: str

        :return: The HTTP status, the queried discounts or None, and a message.
        :rtype: Tuple[HTTPStatus, List[Discount], str]

        """
        try:
            range_key_prefix = f'v{self.latest_version}#{event_id}'
            range_key_condition = Discount.rangeKey.startswith(range_key_prefix)

            discount_entries = list(
                Discount.query(
                    hash_key=self.core_obj,
                    range_key_condition=range_key_condition,
                    filter_condition=Discount.entryStatus == EntryStatus.ACTIVE.value,
                )
            )

            if not discount_entries:
                message = 'No discounts found'
                logger.error(f'[{self.core_obj}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query discount: {str(e)}'
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
            logger.info(f'[{self.core_obj} = Fetch Discount data successful')
            return HTTPStatus.OK, discount_entries, None

    def query_discount_with_discount_id(self, event_id: str, discount_id: str) -> Tuple[HTTPStatus, Discount, str]:
        """Query discounts by discount ID.

        :param event_id: The ID of the event to query discounts for.
        :type event_id: str

        :param discount_id: The ID of the discount to query, defaults to None.
        :type discount_id: str

        :return: The HTTP status, the queried discounts or None, and a message.
        :rtype: Tuple[HTTPStatus, Discount, str]

        """
        try:
            range_key_prefix = f'v{self.latest_version}#{event_id}#{discount_id}'
            range_key_condition = Discount.rangeKey.__eq__(range_key_prefix)

            discount_entries = list(
                Discount.query(
                    hash_key=self.core_obj,
                    range_key_condition=range_key_condition,
                    filter_condition=Discount.entryStatus == EntryStatus.ACTIVE.value,
                )
            )

            if not discount_entries:
                message = f'Discount with ID = {discount_id} not found'
                logger.error(f'[{self.core_obj} = {discount_id}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query discount: {str(e)}'
            logger.error(f'[{self.core_obj}={discount_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj}={discount_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj}={discount_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj}={discount_id}] Fetch Discount data successful')
            return HTTPStatus.OK, discount_entries[0], None

    def update_discount(self, discount_entry: Discount, discount_in: DiscountDBIn) -> Tuple[HTTPStatus, Discount, str]:
        """Update a discount.

        :param discount_entry: The discount entry to update.
        :type discount_entry: Discount

        :param discount_in: The new discount data.
        :type discount_in: DiscountDBIn

        :return: The HTTP status, the updated discount or None, and a message.
        :rtype: Tuple[HTTPStatus, Discount, str]

        """
        current_version = discount_entry.latestVersion
        new_version = current_version + 1

        data = RepositoryUtils.load_data(pydantic_schema_in=discount_in, exclude_unset=True)
        has_update, updated_data = RepositoryUtils.get_update(
            old_data=RepositoryUtils.db_model_to_dict(discount_entry), new_data=data
        )
        if not has_update:
            return HTTPStatus.OK, discount_entry, 'no update'
        try:
            with TransactWrite(connection=self.conn) as transaction:
                # Update Entry -----------------------------------------------------------------------------
                # check if there's update or none
                updated_data.update(
                    updateDate=self.current_date,
                    updatedBy=os.getenv('CURRENT_USER'),
                    latestVersion=new_version,
                )
                actions = [getattr(Discount, k).set(v) for k, v in updated_data.items()]
                transaction.update(discount_entry, actions=actions)

                # Store Old Entry --------------------------------------------------------------------------
                old_discount_entry = deepcopy(discount_entry)
                old_discount_entry.rangeKey = discount_entry.rangeKey.replace('v0#', f'v{new_version}#')
                old_discount_entry.latestVersion = current_version
                old_discount_entry.updatedBy = old_discount_entry.updatedBy or os.getenv('CURRENT_USER')
                transaction.save(old_discount_entry)

            discount_entry.refresh()
            logger.info(f'[{discount_entry.rangeKey}] ' f'Update discount data successful')
            return HTTPStatus.OK, discount_entry, ''

        except TransactWriteError as e:
            message = f'Failed to update discount data: {str(e)}'
            logger.error(f'[{discount_entry.rangeKey}] {message}')

            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

    def delete_discount(self, discount_entry: Discount) -> Tuple[HTTPStatus, str]:
        """Delete a discount.

        :param discount_entry: The discount entry to delete.
        :type discount_entry: Discount

        :return: The HTTP status and a message.
        :rtype: Tuple[HTTPStatus, str]

        """
        try:
            # create new entry with old data
            current_version = discount_entry.latestVersion
            new_version = current_version + 1
            old_discount_entry = deepcopy(discount_entry)
            old_discount_entry.rangeKey = discount_entry.rangeKey.replace('v0#', f'v{new_version}#')
            old_discount_entry.updatedBy = old_discount_entry.updatedBy or os.getenv('CURRENT_USER')
            old_discount_entry.save()

            # set entry status to deleted
            discount_entry.updateDate = self.current_date
            discount_entry.updatedBy = os.getenv('CURRENT_USER')
            discount_entry.latestVersion = new_version
            discount_entry.entryStatus = EntryStatus.DELETED.value
            discount_entry.save()

            logger.info(f'[{discount_entry.rangeKey}] ' f'Delete discount data successful')
            return HTTPStatus.OK, None
        except PutError as e:
            message = f'Failed to delete discount data: {str(e)}'
            logger.error(f'[{discount_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, message
