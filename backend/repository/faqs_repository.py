import os
from copy import deepcopy
from datetime import datetime
from http import HTTPStatus
from typing import Tuple

from constants.common_constants import EntryStatus
from model.faqs.faqs import FAQs, FAQsIn
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


class FAQsRepository:
    def __init__(self) -> None:
        self.core_obj = 'FAQs'
        self.current_date = datetime.utcnow().isoformat()
        self.latest_version = 0
        self.conn = Connection(region=os.getenv('REGION'))

    def store_faqs(self, event_id: str, faqs_in: FAQsIn) -> Tuple[HTTPStatus, FAQs, str]:
        entry_id = event_id
        data = RepositoryUtils.load_data(pydantic_schema_in=faqs_in)
        range_key = f'v{self.latest_version}#{event_id}'
        try:
            faqs_entry = FAQs(
                hashKey=self.core_obj,
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
            faqs_entry.save()

        except PutError as e:
            message = f'Failed to save faqs strategy form: {str(e)}'
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
            logger.info(f'[{self.core_obj} = {entry_id}]: Save FAQs strategy data successful')
            return HTTPStatus.OK, faqs_entry, None

    def query_faq_entry(self, event_id: str) -> Tuple[HTTPStatus, FAQs, str]:
        try:
            range_key_prefix = f'v{self.latest_version}#{event_id}'
            range_key_condition = FAQs.rangeKey.__eq__(range_key_prefix)

            faqs_entries = list(
                FAQs.query(
                    hash_key=self.core_obj,
                    range_key_condition=range_key_condition,
                    filter_condition=FAQs.entryStatus == EntryStatus.ACTIVE.value,
                )
            )
            if not faqs_entries:
                message = f'FAQs with ID={event_id} not found'
                logger.error(f'[{self.core_obj}={event_id}] {message}')

                return HTTPStatus.NOT_FOUND, None, message

        except QueryError as e:
            message = f'Failed to query faqs: {str(e)}'
            logger.error(f'[{self.core_obj}={event_id}] {message}')
            return HTTPStatus.NOT_FOUND, None, message

        except TableDoesNotExist as db_error:
            message = f'Error on Table, Please check config to make sure table is created: {str(db_error)}'
            logger.error(f'[{self.core_obj}={event_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        except PynamoDBConnectionError as db_error:
            message = f'Connection error occurred, Please check config(region, table name, etc): {str(db_error)}'
            logger.error(f'[{self.core_obj}={event_id}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

        else:
            logger.info(f'[{self.core_obj}={event_id}] Fetch FAQs data successful')
            return HTTPStatus.OK, faqs_entries[0], None

    def update_faqs(self, faqs_entry: FAQs, faqs_in: FAQsIn) -> Tuple[HTTPStatus, FAQs, str]:
        current_version = faqs_entry.latestVersion
        new_version = current_version + 1

        data = RepositoryUtils.load_data(pydantic_schema_in=faqs_in, exclude_unset=True)
        has_update, updated_data = RepositoryUtils.get_update(
            old_data=RepositoryUtils.db_model_to_dict(faqs_entry), new_data=data
        )
        if not has_update:
            return HTTPStatus.OK, faqs_entry, 'no update'
        try:
            with TransactWrite(connection=self.conn) as transaction:
                # Update Entry -----------------------------------------------------------------------------
                # check if there's update or none
                updated_data.update(
                    updateDate=self.current_date,
                    updatedBy=os.getenv('CURRENT_USER'),
                    latestVersion=new_version,
                )
                actions = [getattr(FAQs, k).set(v) for k, v in updated_data.items()]
                transaction.update(faqs_entry, actions=actions)

                # Store Old Entry --------------------------------------------------------------------------
                old_faqs_entry = deepcopy(faqs_entry)
                old_faqs_entry.rangeKey = faqs_entry.rangeKey.replace('v0#', f'v{new_version}#')
                old_faqs_entry.latestVersion = current_version
                old_faqs_entry.updatedBy = old_faqs_entry.updatedBy or os.getenv('CURRENT_USER')
                transaction.save(old_faqs_entry)

            faqs_entry.refresh()
            logger.info(f'[{faqs_entry.rangeKey}] ' f'Update faqs data successful')
            return HTTPStatus.OK, faqs_entry, ''

        except TransactWriteError as e:
            message = f'Failed to update faqs data: {str(e)}'
            logger.error(f'[{faqs_entry.rangeKey}] {message}')

            return HTTPStatus.INTERNAL_SERVER_ERROR, None, message

    def delete_faqs(self, faqs_entry: FAQs) -> Tuple[HTTPStatus, str]:
        try:
            # create new entry with old data
            current_version = faqs_entry.latestVersion
            new_version = current_version + 1
            old_faqs_entry = deepcopy(faqs_entry)
            old_faqs_entry.rangeKey = faqs_entry.rangeKey.replace('v0#', f'v{new_version}#')
            old_faqs_entry.updatedBy = old_faqs_entry.updatedBy or os.getenv('CURRENT_USER')
            old_faqs_entry.save()

            # set entry status to deleted
            faqs_entry.updateDate = self.current_date
            faqs_entry.updatedBy = os.getenv('CURRENT_USER')
            faqs_entry.latestVersion = new_version
            faqs_entry.entryStatus = EntryStatus.DELETED.value
            faqs_entry.save()

            logger.info(f'[{faqs_entry.rangeKey}] ' f'Delete faqs data successful')
            return HTTPStatus.OK, None
        except PutError as e:
            message = f'Failed to delete faqs data: {str(e)}'
            logger.error(f'[{faqs_entry.rangeKey}] {message}')
            return HTTPStatus.INTERNAL_SERVER_ERROR, message
