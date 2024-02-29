import logging
import os
from datetime import datetime
from http import HTTPStatus
from typing import List, Tuple

import ulid
from constants.common_constants import EntryStatus
from model.preregistrations.preregistration import PreRegistration, PreRegistrationIn
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
        self.current_date = datetime.utcnow().isoformat()
        self.conn = Connection(region=os.getenv('REGION'))

    def store_preregistration(
        self, preregistration_in: PreRegistrationIn, preregistration_id: str = None
    ) -> Tuple[HTTPStatus, PreRegistration, str]:
        """
        Store a pre-registration record in the database.

        Args:
            preregistration_in (PreRegistrationIn): The pre-registration data to be stored.

        Returns:
            Tuple[HTTPStatus, PreRegistration, str]: A tuple containing HTTP status, the stored pre-registration record,
            and an optional error message.
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
                **data,
            )
            preregistration_entry.certificateGenerated = False
            preregistration_entry.save()

        except PutError as e:
            message = f'Failed to save pre-registration strategy form: {str(e)}'
            logging.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logging.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logging.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logging.info(f'[{self.core_obj} = {preregistration_id}]: Successfully saved pre-registration strategy form')
            return HTTPStatus.OK, preregistration_entry, None

    def query_preregistrations(
        self, event_id: str = None, preregistration_id: str = None
    ) -> Tuple[HTTPStatus, List[PreRegistration], str]:
        """
        Query pre-registration records from the database.

        Args:
            event_id (str, optional): The event ID to query (default is None to query all records).
            preregistration_id (str, optional): The pre-registration ID to query (default is None to query all records).

        Returns:
            Tuple[HTTPStatus, List[PreRegistration], str]: A tuple containing HTTP status, a list of pre-registration records,
            and an optional error message.
        """
        try:
            if event_id is None:
                preregistration_entries = list(
                    PreRegistration.scan(
                        filter_condition=PreRegistration.entryStatus == EntryStatus.ACTIVE.value,
                    )
                )
            elif preregistration_id:
                preregistration_entries = list(
                    PreRegistration.query(
                        hash_key=event_id,
                        range_key_condition=PreRegistration.rangeKey.__eq__(preregistration_id),
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
                if preregistration_id:
                    message = f'Pre-registration with id {preregistration_id} not found'
                    logging.error(f'[{self.core_obj}={preregistration_id}] {message}')
                else:
                    message = 'No pre-registration found'
                    logging.error(f'[{self.core_obj}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query pre-registration: {str(e)}'
            logging.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logging.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logging.error(f'[{self.core_obj} = {preregistration_id}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            if preregistration_id:
                logging.info(f'[{self.core_obj} = {preregistration_id}]: Fetch Pre-registration data successful')
                return HTTPStatus.OK, preregistration_entries[0], None

            logging.info(f'[{self.core_obj}]: Fetch Pre-registration data successful')
            return HTTPStatus.OK, preregistration_entries, None

    def query_preregistrations_with_email(
        self, event_id: str, email: str, exclude_preregistration_id: str = None
    ) -> Tuple[HTTPStatus, List[PreRegistration], str]:
        """
        Query pre-registrations with email

        Args:
            event_id (str, optional): The event ID to query (default is None to query all records).
            email (str, optional): The email to query (default is None to query all records).
            exclude_preregistration (str, optional): The registration ID to exclude (default is None to query all records).

        Returns:
            Tuple[HTTPStatus, List[PreRegistration], str]: A tuple containing HTTP status, a list of pre-registration records,
            and an optional error message.
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
                logging.error(f'[{self.core_obj}={email}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query pre-registrations: {str(e)}'
            logging.error(f'[{self.core_obj} = {email}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logging.error(f'[{self.core_obj} = {email}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logging.error(f'[{self.core_obj} = {email}]: {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
        else:
            logging.info(f'[{self.core_obj}]: Fetch Pre-registration with email successful')
            return HTTPStatus.OK, preregistration_entries, None

    def update_preregistration(
        self, preregistration_entry: PreRegistration, preregistration_in: PreRegistrationIn
    ) -> Tuple[HTTPStatus, PreRegistration, str]:
        """
        Update a pre-registration record in the database.

        Args:
            preregistration_entry (PreRegistration): The existing pre-registration record to be updated.
            preregistration_in (PreRegistrationIn): The new pre-registration data.

        Returns:
            Tuple[HTTPStatus, PreRegistration, str]: A tuple containing HTTP status, the updated pre-registration record,
            and an optional error message.
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
            logging.info(f'[{preregistration_entry.rangeKey}] ' f'Update event data succesful')
            return HTTPStatus.OK, preregistration_entry, ''

        except TransactWriteError as e:
            message = f'Failed to update event data: {str(e)}'
            logging.error(f'[{preregistration_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message
