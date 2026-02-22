import os
from datetime import datetime
from http import HTTPStatus
from typing import List, Tuple

import pytz
import ulid
from constants.common_constants import EntryStatus
from model.preregistrations.preregistration import (
    PreRegistration,
    PreRegistrationIn,
    PreRegistrationPatch,
)
from model.preregistrations.preregistrations_constants import AcceptanceStatus
from pynamodb.connection import Connection
from pynamodb.exceptions import (
    DeleteError,
    PutError,
    PynamoDBConnectionError,
    QueryError,
    TableDoesNotExist,
    TransactWriteError,
)
from pynamodb.transactions import TransactWrite
from repository.repository_utils import RepositoryUtils
from utils.logger import logger


class PreRegistrationsRepository:
    """
    A repository class for managing pre-registration records in a DynamoDB table.

    This class provides methods for storing, querying, updating, and deleting pre-registration records.

    Attributes:
        core_obj (str): The core object name for pre-registration records.
        current_date (str): The current date and time in ISO format.
        conn (Connection): The PynamoDB connection for database operations.
    """

    def __init__(self) -> None:
        self.core_obj = 'PreRegistration'
        self.current_date = datetime.now(tz=pytz.timezone('Asia/Manila')).isoformat()
        self.conn = Connection(region=os.getenv('REGION'))

    def store_preregistration(
        self, preregistration_in: PreRegistrationIn, preregistration_id: str = None
    ) -> Tuple[HTTPStatus, PreRegistration, str]:
        """Store a pre-registration record in the database.

        :param preregistration_in: The pre-registration data to be stored.
        :type preregistration_in: PreRegistrationIn

        :return: A tuple containing HTTP status, the stored pre-registration record, and an optional error message.
        :rtype: Tuple[HTTPStatus, PreRegistration, str]

        """
        data = RepositoryUtils.load_data(pydantic_schema_in=preregistration_in)  # load data from pydantic schema
        preregistration_id = preregistration_id or ulid.ulid()

        try:
            preregistration_entry = PreRegistration(
                hashKey=preregistration_in.eventId,
                rangeKey=preregistration_id,
                createDate=self.current_date,
                updateDate=self.current_date,
                entryStatus=EntryStatus.ACTIVE.value,
                preRegistrationId=preregistration_id,
                acceptanceStatus=AcceptanceStatus.PENDING.value,
                **data,
            )
            preregistration_entry.certificateGenerated = False
            preregistration_entry.save()

        except PutError as e:
            message = f'Failed to save pre-registration strategy form: {str(e)}'
            logger.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj} = {preregistration_id}]: Successfully saved pre-registration strategy form')
            return HTTPStatus.OK, preregistration_entry, None

    def query_preregistrations(self, event_id: str = None) -> Tuple[HTTPStatus, List[PreRegistration], str]:
        """Query pre-registration records from the database.

        :param event_id: The event ID to query (default is None to query all records).
        :type event_id: str

        :return: A tuple containing HTTP status, a list of pre-registration records, and an optional error message.
        :rtype: Tuple[HTTPStatus, List[PreRegistration], str]

        """
        try:
            if event_id is None:
                preregistration_entries = list(
                    PreRegistration.scan(
                        filter_condition=PreRegistration.entryStatus == EntryStatus.ACTIVE.value,
                    )
                )
            else:
                preregistration_entries = list(
                    PreRegistration.query(
                        hash_key=event_id,
                        filter_condition=PreRegistration.entryStatus == EntryStatus.ACTIVE.value,
                    )
                )

            if not preregistration_entries:
                message = 'No pre-registration found'
                logger.error(f'[{self.core_obj}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query pre-registration: {str(e)}'
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
            logger.info(f'[{self.core_obj}]: Fetch Pre-registration data successful')
            return HTTPStatus.OK, preregistration_entries, None

    def query_preregistration_with_preregistration_id(
        self, preregistration_id: str, event_id: str
    ) -> Tuple[HTTPStatus, PreRegistration, str]:
        """Query pre-registration records from the database specific to a preregistration ID.

        :param event_id: The event ID to query.
        :type event_id: str

        :param preregistration_id: The pre-registration ID to query.
        :type preregistration_id: str

        :return: A tuple containing HTTP status, a list of pre-registration records, and an optional error message.
        :rtype: Tuple[HTTPStatus, PreRegistration, str]

        """
        try:
            preregistration_entries = list(
                PreRegistration.query(
                    hash_key=event_id,
                    range_key_condition=PreRegistration.rangeKey.__eq__(preregistration_id),
                    filter_condition=PreRegistration.entryStatus == EntryStatus.ACTIVE.value,
                )
            )

            if not preregistration_entries:
                message = f'Pre-registration with id {preregistration_id} not found'
                logger.error(f'[{self.core_obj}={preregistration_id}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query pre-registration: {str(e)}'
            logger.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj} = {preregistration_id}]: Fetch Pre-registration data successful')
            return HTTPStatus.OK, preregistration_entries[0], None

    def query_preregistrations_with_email(
        self, event_id: str, email: str, exclude_preregistration_id: str = None
    ) -> Tuple[HTTPStatus, List[PreRegistration], str]:
        """Query pre-registrations with email.

        :param event_id: The event ID to query (default is None to query all records).
        :type event_id: str

        :param email: The email to query (default is None to query all records).
        :type email: str

        :param exclude_preregistration: The registration ID to exclude (default is None to query all records).
        :type exclude_preregistration: str

        :return: A tuple containing HTTP status, a list of pre-registration records, and an optional error message.
        :rtype: Tuple[HTTPStatus, List[PreRegistration], str]

        """
        try:
            filter_condition = PreRegistration.entryStatus.__eq__(EntryStatus.ACTIVE.value)
            if exclude_preregistration_id:
                filter_condition &= PreRegistration.preRegistrationId != exclude_preregistration_id

            preregistration_entries = list(
                PreRegistration.emailLSI.query(
                    hash_key=event_id,
                    range_key_condition=PreRegistration.email.__eq__(email),
                    filter_condition=filter_condition,
                )
            )

            if not preregistration_entries:
                message = f'Pre-registration with email {email} not found'
                logger.error(f'[{self.core_obj}={email}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query pre-registrations: {str(e)}'
            logger.error(f'[{self.core_obj} = {email}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj} = {email}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj} = {email}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj}]: Fetch Pre-registration with email successful')
            return HTTPStatus.OK, preregistration_entries, None

    def update_preregistration(
        self, preregistration_entry: PreRegistration, preregistration_in: PreRegistrationPatch
    ) -> Tuple[HTTPStatus, PreRegistration, str]:
        """Update a pre-registration record in the database.

        :param preregistration_entry: The existing pre-registration record to be updated.
        :type preregistration_entry: PreRegistration

        :param preregistration_in: The new pre-registration data.
        :type preregistration_in: PreRegistrationPatch

        :return: A tuple containing HTTP status, the updated pre-registration record, and an optional error message.
        :rtype: Tuple[HTTPStatus, PreRegistration, str]

        """
        data = RepositoryUtils.load_data(pydantic_schema_in=preregistration_in, exclude_unset=True)
        has_update, updated_data = RepositoryUtils.get_update(
            old_data=RepositoryUtils.db_model_to_dict(preregistration_entry), new_data=data
        )
        if not has_update:
            return HTTPStatus.OK, preregistration_entry, 'No update'

        try:
            with TransactWrite(connection=self.conn) as transaction:
                # Update Entry
                updated_data.update(
                    updateDate=self.current_date,
                )
                actions = [getattr(PreRegistration, k).set(v) for k, v in updated_data.items()]
                transaction.update(preregistration_entry, actions=actions)

            preregistration_entry.refresh()
            logger.info(f'[{preregistration_entry.rangeKey}] Update event data succesful')
            return HTTPStatus.OK, preregistration_entry, ''

        except TransactWriteError as e:
            message = f'Failed to update event data: {str(e)}'
            logger.error(f'[{preregistration_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

    def delete_preregistration(self, preregistration_entry: PreRegistration) -> HTTPStatus:
        """Delete a preregistration record from the database.

        :param registration_entry: The registration record to be deleted.
        :type registration_entry: Registration

        :return: The HTTP status of the operation.
        :rtype: HTTPStatus

        """
        try:
            preregistration_entry.delete()
            logger.info(f'[{preregistration_entry.rangeKey}] Delete Preregistration data successful')
            return HTTPStatus.OK, None

        except DeleteError as e:
            message = f'Failed to delete event data: {str(e)}'
            logger.error(f'[{preregistration_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR
