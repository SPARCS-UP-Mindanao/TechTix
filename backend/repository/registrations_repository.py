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
    PutError,
    PynamoDBConnectionError,
    QueryError,
    TableDoesNotExist,
    TransactWriteError,
)
from pynamodb.transactions import TransactWrite
from repository.repository_utils import RepositoryUtils


class RegistrationsRepository:
    def __init__(self) -> None:
        self.core_obj = 'Registration'
        self.current_date = datetime.utcnow().isoformat()
        self.conn = Connection(region=os.getenv('REGION'))

    def store_registration(self, registration_in: RegistrationIn) -> Tuple[HTTPStatus, Registration, str]:
        data = RepositoryUtils.load_data(pydantic_schema_in=registration_in) # load data from pydantic schema
        registration_id = ulid.ulid()
        range_key = f'{registration_id}'
        try:
            registration_entry = Registration(
                hashKey=self.core_obj,
                rangeKey=range_key,
                createDate=self.current_date,
                updateDate=self.current_date,
                createdBy=os.getenv('CURRENT_USER'),
                updatedBy=os.getenv('CURRENT_USER'),
                entryStatus=EntryStatus.ACTIVE.value,
                status=RegistrationStatus.DRAFT.value,
                entryId=registration_id,
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

    def query_registrations(self, registration_id: str = None) -> Tuple[HTTPStatus, List[Registration], str]:
        try:
            registration_entries = list(
                Registration.query(
                    hash_key=self.core_obj,
                    # range_key=registration_id,
                    filter_condition=Registration.entryStatus == EntryStatus.ACTIVE.value,
                )
            )
            
            if not registration_entries:
                if registration_id:
                    message = f'Registration with id {registration_id} not found'
                    logging.error(f'[{self.core_obj}={registration_id}] {message}')
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

    def update_registration(self, registration_entry: Registration, registration_in: RegistrationIn) -> Tuple[HTTPStatus, Registration, str]:
        
        data = RepositoryUtils.load_data(pydantic_schema_in=registration_in, exclude_unset=True)
        has_update, updated_data = RepositoryUtils.get_update(
            old_data = RepositoryUtils.db_model_to_dict(registration_entry), new_data=data
        )
        if not has_update:
            return HTTPStatus.OK, registration_entry, 'No update'
        
        try:
            with TransactWrite(conneciton=self.conn) as transaction:
                # Update Entry
                updated_data.update(
                    updateDate=self.current_date,
                    updatedBy=os.getenv('CURRENT_USER'),
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
        try: 
            registration_entry.delete()
            
            #logging.info(f'[{registration_entry.rangeKey}] ' f'Delete event data successful')
            return HTTPStatus.OK
        except PutError as e:
            message = f'Failed to delete event data: {str(e)}'
            logging.error(f'[{registration_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR