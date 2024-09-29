import os
from copy import deepcopy
from datetime import datetime
from http import HTTPStatus
from typing import List, Tuple

import pytz
from constants.common_constants import EntryStatus
from model.ticket_types.ticket_types import TicketType, TicketTypeIn
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


class TicketTypeRepository:
    def __init__(self) -> None:
        self.core_obj = 'TicketType'
        self.current_date = datetime.now(tz=pytz.timezone('Asia/Manila')).isoformat()
        self.latest_version = 0
        self.conn = Connection(region=os.getenv('REGION'))

    def store_ticket_type(self, ticket_type_in: TicketTypeIn) -> Tuple[HTTPStatus, TicketType, str]:
        """Store a new ticket_type.

        :param ticket_type_in: The ticket_type data to store.
        :type ticket_type_in: TicketTypeIn

        :return: The HTTP status, the stored ticket_type or None, and a message.
        :rtype: Tuple[HTTPStatus, TicketType, str]

        """
        data = RepositoryUtils.load_data(pydantic_schema_in=ticket_type_in)
        entry_id = ticket_type_in.konfhubId
        event_id = ticket_type_in.eventId
        hash_key = f'{self.core_obj}#{event_id}'
        range_key = f'v{self.latest_version}#{entry_id}'
        try:
            ticket_type_entry = TicketType(
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
            ticket_type_entry.save()

        except PutError as e:
            message = f'Failed to save ticket_type form: {str(e)}'
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
            logger.info(f'[{self.core_obj} = {entry_id}]: Save TicketType data successful')
            return HTTPStatus.OK, ticket_type_entry, None

    def query_ticket_types(self, event_id: str) -> Tuple[HTTPStatus, List[TicketType], str]:
        """Query ticket_types by event.

        :param event_id: The ID of the event to query ticket_types for.
        :type event_id: str

        :return: The HTTP status, the queried ticket_types or None, and a message.
        :rtype: Tuple[HTTPStatus, List[TicketType], str]

        """
        try:
            hash_key = f'{self.core_obj}#{event_id}'
            range_key_prefix = f'v{self.latest_version}#'
            range_key_condition = TicketType.rangeKey.startswith(range_key_prefix)

            ticket_type_entries = list(
                TicketType.query(
                    hash_key=hash_key,
                    range_key_condition=range_key_condition,
                    filter_condition=TicketType.entryStatus == EntryStatus.ACTIVE.value,
                )
            )

            if not ticket_type_entries:
                message = 'No ticket_types found'
                logger.error(f'[{self.core_obj}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query ticket_type: {str(e)}'
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
            logger.info(f'[{self.core_obj} = Fetch TicketType data successful')
            return HTTPStatus.OK, ticket_type_entries, None

    def query_ticket_type_with_ticket_type_id(
        self, event_id: str, ticket_type_id: str
    ) -> Tuple[HTTPStatus, TicketType, str]:
        """Query ticket_types by ticket_type ID.

        :param event_id: The ID of the event to query ticket_types for.
        :type event_id: str

        :param ticket_type_id: The ID of the ticket_type to query, defaults to None.
        :type ticket_type_id: str

        :return: The HTTP status, the queried ticket_types or None, and a message.
        :rtype: Tuple[HTTPStatus, TicketType, str]

        """
        try:
            hash_key = f'{self.core_obj}#{event_id}'
            range_key_prefix = f'v{self.latest_version}#{ticket_type_id}'
            range_key_condition = TicketType.rangeKey.__eq__(range_key_prefix)

            ticket_type_entries = list(
                TicketType.query(
                    hash_key=hash_key,
                    range_key_condition=range_key_condition,
                    filter_condition=TicketType.entryStatus == EntryStatus.ACTIVE.value,
                )
            )

            if not ticket_type_entries:
                message = f'TicketType with ID = {ticket_type_id} not found'
                logger.error(f'[{self.core_obj} = {ticket_type_id}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query ticket_type: {str(e)}'
            logger.error(f'[{self.core_obj}={ticket_type_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj}={ticket_type_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj}={ticket_type_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj}={ticket_type_id}] Fetch TicketType data successful')
            return HTTPStatus.OK, ticket_type_entries[0], None

    def update_ticket_type(
        self, ticket_type_entry: TicketType, ticket_type_in: TicketTypeIn
    ) -> Tuple[HTTPStatus, TicketType, str]:
        """Update a ticket_type.

        :param ticket_type_entry: The ticket_type entry to update.
        :type ticket_type_entry: TicketType

        :param ticket_type_in: The new ticket_type data.
        :type ticket_type_in: TicketTypeIn

        :return: The HTTP status, the updated ticket_type or None, and a message.
        :rtype: Tuple[HTTPStatus, TicketType, str]

        """
        current_version = ticket_type_entry.latestVersion
        new_version = current_version + 1

        data = RepositoryUtils.load_data(pydantic_schema_in=ticket_type_in, exclude_unset=True)
        has_update, updated_data = RepositoryUtils.get_update(
            old_data=RepositoryUtils.db_model_to_dict(ticket_type_entry), new_data=data
        )
        if not has_update:
            return HTTPStatus.OK, ticket_type_entry, 'no update'
        try:
            with TransactWrite(connection=self.conn) as transaction:
                # Update Entry -----------------------------------------------------------------------------
                # check if there's update or none
                updated_data.update(
                    updateDate=self.current_date,
                    updatedBy=os.getenv('CURRENT_USER'),
                    latestVersion=new_version,
                )
                actions = [getattr(TicketType, k).set(v) for k, v in updated_data.items()]
                transaction.update(ticket_type_entry, actions=actions)

                # Store Old Entry --------------------------------------------------------------------------
                old_ticket_type_entry = deepcopy(ticket_type_entry)
                old_ticket_type_entry.rangeKey = ticket_type_entry.rangeKey.replace('v0#', f'v{new_version}#')
                old_ticket_type_entry.latestVersion = current_version
                old_ticket_type_entry.updatedBy = old_ticket_type_entry.updatedBy or os.getenv('CURRENT_USER')
                transaction.save(old_ticket_type_entry)

            ticket_type_entry.refresh()
            logger.info(f'[{ticket_type_entry.rangeKey}] ' f'Update ticket_type data successful')
            return HTTPStatus.OK, ticket_type_entry, ''

        except TransactWriteError as e:
            message = f'Failed to update ticket_type data: {str(e)}'
            logger.error(f'[{ticket_type_entry.rangeKey}] {message}')

            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

    def delete_ticket_type(self, ticket_type_entry: TicketType) -> Tuple[HTTPStatus, str]:
        """Delete a ticket_type.

        :param ticket_type_entry: The ticket_type entry to delete.
        :type ticket_type_entry: TicketType

        :return: The HTTP status and a message.
        :rtype: Tuple[HTTPStatus, str]

        """
        try:
            # create new entry with old data
            current_version = ticket_type_entry.latestVersion
            new_version = current_version + 1
            old_ticket_type_entry = deepcopy(ticket_type_entry)
            old_ticket_type_entry.rangeKey = ticket_type_entry.rangeKey.replace('v0#', f'v{new_version}#')
            old_ticket_type_entry.updatedBy = old_ticket_type_entry.updatedBy or os.getenv('CURRENT_USER')
            old_ticket_type_entry.save()

            # set entry status to deleted
            ticket_type_entry.updateDate = self.current_date
            ticket_type_entry.updatedBy = os.getenv('CURRENT_USER')
            ticket_type_entry.latestVersion = new_version
            ticket_type_entry.entryStatus = EntryStatus.DELETED.value
            ticket_type_entry.save()

            logger.info(f'[{ticket_type_entry.rangeKey}] ' f'Delete ticket_type data successful')
            return HTTPStatus.OK, None
        except PutError as e:
            message = f'Failed to delete ticket_type data: {str(e)}'
            logger.error(f'[{ticket_type_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, message

    def append_ticket_type_sales(self, ticket_type_entry: TicketType, append_count: int = 1):
        """Adds the currentSales attribute of the ticket_type_entry by append_count

        :param ticket_type_entry: The TicketType object to be updated.
        :type ticket_type_entry: TicketType

        :param append_count: The count to be appended.
        :type append_count: int

        :return: Tuple containing the HTTP status, the updated TicketType object, and a message.
        :rtype: Tuple[HTTPStatus, TicketType, str]

        """
        try:
            ticket_type_entry.update(actions=[TicketType.currentSales.add(append_count)])
            ticket_type_entry.save()

        except PutError as e:
            message = f'Failed to append ticket_type sales count: {str(e)}'
            logger.error(f'[{ticket_type_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, message

        else:
            logger.info(f'[{ticket_type_entry.rangeKey}] ' f'Update ticket_type data successful')
            return HTTPStatus.OK, ticket_type_entry, ''
