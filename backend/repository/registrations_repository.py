import logging
import os
from datetime import datetime
from http import HTTPStatus
from typing import List, Tuple

import ulid
from constants.common_constants import EntryStatus
from model.registrations.registration import Registration, RegistrationIn
from model.registrations.registrations_constants import RegistrationStatus
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
        self.current_date = datetime.utcnow().isoformat()
        self.conn = Connection(region=os.getenv('REGION'))

    def store_registration(self, registration_in: RegistrationIn) -> Tuple[HTTPStatus, Registration, str]:
        """
        Store a registration record in the database.

        Args:
            registration_in (RegistrationIn): The registration data to be stored.

        Returns:
            Tuple[HTTPStatus, Registration, str]: A tuple containing HTTP status, the stored registration record,
            and an optional error message.
        """
        data = RepositoryUtils.load_data(pydantic_schema_in=registration_in)  # load data from pydantic schema
        registration_id = ulid.ulid()

        try:
            registration_entry = Registration(
                hashKey=registration_in.eventId,
                rangeKey=registration_id,
                createDate=self.current_date,
                updateDate=self.current_date,
                entryStatus=EntryStatus.ACTIVE.value,
                status=RegistrationStatus.DRAFT.value,
                registrationId=registration_id,
                **data,
            )
            registration_entry.save()

        except PutError as e:
            message = f'Failed to save registration strategy form: {str(e)}'
            logging.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logging.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logging.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logging.info(f'[{self.core_obj} = {registration_id}]: Successfully saved registration strategy form')
            return HTTPStatus.OK, registration_entry, None

    def query_registrations(
        self, event_id: str = None, registration_id: str = None, email: str = None
    ) -> Tuple[HTTPStatus, List[Registration], str]:
        """
        Query registration records from the database.

        Args:
            event_id (str, optional): The event ID to query (default is None to query all records).
            registration_id (str, optional): The registration ID to query (default is None to query all records).
            email (str, optional): The email to query (default is None to query all records).

        Returns:
            Tuple[HTTPStatus, List[Registration], str]: A tuple containing HTTP status, a list of registration records,
            and an optional error message.
        """
        try:
            if event_id is None:
                registration_entries = list(
                    Registration.scan(
                        filter_condition=Registration.entryStatus == EntryStatus.ACTIVE.value,
                    )
                )
            elif registration_id:
                registration_entries = list(
                    Registration.query(
                        hash_key=event_id,
                        range_key_condition=Registration.rangeKey.__eq__(registration_id),
                        filter_condition=Registration.entryStatus == EntryStatus.ACTIVE.value,
                    )
                )
            elif email:
                registration_entries = list(
                    Registration.emailLSI.query(
                        hash_key=event_id
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
                if registration_id:
                    message = f'Registration with id {registration_id} not found'
                    logging.error(f'[{self.core_obj}={registration_id}] {message}')
                elif email:
                    message = f'Registration with email {email} not found'
                    logging.error(f'[{self.core_obj}={email}] {message}')
                else:
                    message = 'No registration found'
                    logging.error(f'[{self.core_obj}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query registration: {str(e)}'
            logging.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logging.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logging.error(f'[{self.core_obj} = {registration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            if registration_id:
                logging.info(f'[{self.core_obj} = {registration_id}]: Fetch Registration data successful')
                return HTTPStatus.OK, registration_entries[0], None

            logging.info(f'[{self.core_obj}]: Fetch Event data successful')
            return HTTPStatus.OK, registration_entries, None

    def update_registration(
        self, registration_entry: Registration, registration_in: RegistrationIn
    ) -> Tuple[HTTPStatus, Registration, str]:
        """
        Update a registration record in the database.

        Args:
            registration_entry (Registration): The existing registration record to be updated.
            registration_in (RegistrationIn): The new registration data.

        Returns:
            Tuple[HTTPStatus, Registration, str]: A tuple containing HTTP status, the updated registration record,
            and an optional error message.
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
            logging.info(f'[{registration_entry.rangeKey}] ' f'Update event data succesful')
            return HTTPStatus.OK, registration_entry, ''

        except TransactWriteError as e:
            message = f'Failed to update event data: {str(e)}'
            logging.error(f'[{registration_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

    def delete_registration(self, registration_entry: Registration) -> HTTPStatus:
        """
        Delete a registration record from the database.

        Args:
            registration_entry (Registration): The registration record to be deleted.

        Returns:
            HTTPStatus: The HTTP status of the operation.
        """
        try:
            registration_entry.delete()
            logging.info(f'[{registration_entry.rangeKey}] ' f'Delete event data successful')
            return HTTPStatus.OK, None

        except DeleteError as e:
            message = f'Failed to delete event data: {str(e)}'
            logging.error(f'[{registration_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR
