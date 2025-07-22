import os
from datetime import datetime
from http import HTTPStatus
from typing import List, Tuple

import pytz
import ulid
from constants.common_constants import EntryStatus
from model.registrations.registration import Registration, RegistrationIn
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


class RegistrationsRepository:
    """
    A repository class for managing registration records in a DynamoDB table.

    This class provides methods for storing, querying, updating, and deleting registration records.

    Attributes:
        core_obj (str): The core object name for registration records.
        current_date (str): The current date and time in ISO format.
        conn (Connection): The PynamoDB connection for database operations.
    """

    def __init__(self) -> None:
        self.core_obj = 'Registration'
        self.current_date = datetime.now(tz=pytz.timezone('Asia/Manila')).isoformat()
        self.conn = Connection(region=os.getenv('REGION'))

    def store_registration(
        self, registration_in: RegistrationIn, registration_id: str = None
    ) -> Tuple[HTTPStatus, Registration, str]:
        """Store a registration record in the database.

        :param registration_in: The registration data to be stored.
        :type registration_in: RegistrationIn

        :param registration_id: The registration ID to be stored. If not provided, a new ULID will be generated.
        :type registration_id: str

        :return: A tuple containing HTTP status, the stored registration record, and an optional error message.
        :rtype: Tuple[HTTPStatus, Registration, str]

        """
        data = RepositoryUtils.load_data(pydantic_schema_in=registration_in)  # load data from pydantic schema
        registration_id = registration_id or ulid.ulid()

        try:
            registration_entry = Registration(
                hashKey=registration_in.eventId,
                rangeKey=registration_id,
                createDate=self.current_date,
                updateDate=self.current_date,
                entryStatus=EntryStatus.ACTIVE.value,
                registrationId=registration_id,
                **data,
            )
            registration_entry.certificateGenerated = False
            registration_entry.save()

        except PutError as e:
            message = f'Failed to save registration strategy form: {str(e)}'
            logger.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj} = {registration_id}]: Successfully saved registration strategy form')
            return HTTPStatus.OK, registration_entry, None

    def query_registrations(self, event_id: str = None) -> Tuple[HTTPStatus, List[Registration], str]:
        """Query a list of registration records from the database.

        :param event_id: The event ID to query (default is None to query all records).
        :type event_id: str

        :return: A tuple containing HTTP status, a list of registration records, and an optional error message.
        :rtype: Tuple[HTTPStatus, List[Registration], str]

        """
        try:
            if event_id is None:
                registration_entries = list(
                    Registration.scan(
                        filter_condition=Registration.entryStatus == EntryStatus.ACTIVE.value,
                    )
                )
            else:
                registration_entries = list(
                    Registration.query(
                        hash_key=event_id,
                        filter_condition=Registration.entryStatus == EntryStatus.ACTIVE.value,
                    )
                )

            if not registration_entries:
                message = 'No registration found'
                logger.error(f'[{self.core_obj}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query registration: {str(e)}'
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
            logger.info(f'[{self.core_obj}]: Fetch Registration data successful')
            return HTTPStatus.OK, registration_entries, None

    def query_registration_with_registration_id(
        self, registration_id: str, event_id: str
    ) -> Tuple[HTTPStatus, Registration, str]:
        """Query a specific registration record from the database.

        :param event_id: The event ID to query.
        :type event_id: str

        :param registration_id: The event ID to query.
        :type registration_id: str

        :return: A tuple containing HTTP status, a list of registration records, and an optional error message.
        :rtype: Tuple[HTTPStatus, List[Registration], str]

        """
        try:
            registration_entries = list(
                Registration.query(
                    hash_key=event_id,
                    range_key_condition=Registration.rangeKey.__eq__(registration_id),
                    filter_condition=Registration.entryStatus == EntryStatus.ACTIVE.value,
                )
            )

            if not registration_entries:
                message = f'Registration with id {registration_id} not found'
                logger.error(f'[{self.core_obj} = {registration_id}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query registration: {str(e)}'
            logger.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logger.info(f'[{self.core_obj} = {registration_id}]: Fetch Registration data successful')
            return HTTPStatus.OK, registration_entries[0], None

    def query_registrations_with_email(
        self, event_id: str, email: str, exclude_registration_id: str = None
    ) -> Tuple[HTTPStatus, List[Registration], str]:
        """Query registrations with email

        :param event_id: The event ID to query (default is None to query all records).
        :type event_id: str

        :param email: The email to query (default is None to query all records).
        :type event_id: str

        :param exclude_registration: The registration ID to exclude (default is None to query all records).
        :type event_id: str

        :return: A tuple containing HTTP status, a list of registration records, and an optional error message.
        :rtype: Tuple[HTTPStatus, List[Registration], str]

        """
        try:
            filter_condition = Registration.entryStatus.__eq__(EntryStatus.ACTIVE.value)
            if exclude_registration_id:
                filter_condition &= Registration.registrationId != exclude_registration_id

            registration_entries = list(
                Registration.emailLSI.query(
                    hash_key=event_id,
                    range_key_condition=Registration.email.__eq__(email),
                    filter_condition=filter_condition,
                )
            )

            if not registration_entries:
                message = f'Registration with email {email} not found'
                logger.error(f'[{self.core_obj}={email}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query registrations: {str(e)}'
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
            logger.info(f'[{self.core_obj}]: Fetch Registration with email successful')
            return HTTPStatus.OK, registration_entries, None

    def update_registration(
        self, registration_entry: Registration, registration_in: RegistrationIn
    ) -> Tuple[HTTPStatus, Registration, str]:
        """Update a registration record in the database.

        :param registration_entry: The existing registration record to be updated.
        :type registration_entry: Registration

        :param registration_in: The new registration data.
        :type registration_in: RegistrationIn

        :return: A tuple containing HTTP status, the updated registration record, and an optional error message.
        :rtype: Tuple[HTTPStatus, Registration, str]

        """
        data = RepositoryUtils.load_data(pydantic_schema_in=registration_in, exclude_unset=True)
        has_update, updated_data = RepositoryUtils.get_update(
            old_data=RepositoryUtils.db_model_to_dict(registration_entry), new_data=data
        )
        if not has_update:
            return HTTPStatus.OK, registration_entry, 'No update'

        try:
            with TransactWrite(connection=self.conn) as transaction:
                # Update Entry
                updated_data.update(
                    updateDate=self.current_date,
                )
                actions = [getattr(Registration, k).set(v) for k, v in updated_data.items()]
                transaction.update(registration_entry, actions=actions)

            registration_entry.refresh()
            logger.info(f'[{registration_entry.rangeKey}] Update event data succesful')
            return HTTPStatus.OK, registration_entry, ''

        except TransactWriteError as e:
            message = f'Failed to update event data: {str(e)}'
            logger.error(f'[{registration_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

    def delete_registration(self, registration_entry: Registration) -> HTTPStatus:
        """Delete a registration record from the database.

        :param registration_entry: The registration record to be deleted.
        :type registration_entry: Registration

        :return: The HTTP status of the operation.
        :rtype: HTTPStatus

        """
        try:
            registration_entry.delete()
            logger.info(f'[{registration_entry.rangeKey}] Delete registration data successful')
            return HTTPStatus.OK, None

        except DeleteError as e:
            message = f'Failed to delete event data: {str(e)}'
            logger.error(f'[{registration_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR
