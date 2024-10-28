import csv
import json
import os
import tempfile
from http import HTTPStatus
from typing import List, Union

import ulid
from model.events.events_constants import EventStatus
from model.file_uploads.file_upload import FileDownloadOut
from model.preregistrations.preregistration import (
    PreRegistrationIn,
    PreRegistrationOut,
    PreRegistrationPatch,
)
from repository.events_repository import EventsRepository
from repository.preregistrations_repository import PreRegistrationsRepository
from starlette.responses import JSONResponse
from usecase.email_usecase import EmailUsecase
from usecase.file_s3_usecase import FileS3Usecase
from utils.logger import logger


class PreRegistrationUsecase:
    """
    Handles the business logic for managing pre-registration entries.

    This class provides methods for creating, updating, retrieving, listing, and deleting pre-registration entries.

    Attributes:
        preregistrations_repository (PreRegistrationsRepository): An instance of the PreRegistrationsRepository used for data access.
    """

    def __init__(self):
        self.__preregistrations_repository = PreRegistrationsRepository()
        self.__events_repository = EventsRepository()
        self.__email_usecase = EmailUsecase()
        self.__s3_usecase = FileS3Usecase()

    def create_preregistration(self, preregistration_in: PreRegistrationIn) -> Union[JSONResponse, PreRegistrationOut]:
        """Creates a new pre-registration entry.

        :param preregistration_in: The data for creating the new pre-registration.
        :type preregistration_in: PreRegistrationIn

        :return: If successful, returns the created pre-registration entry. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, PreRegistrationOut]

        """
        status, event, message = self.__events_repository.query_events(event_id=preregistration_in.eventId)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        is_preregistration = event.status == EventStatus.PRE_REGISTRATION.value
        # Check if the event is open for pre-registration
        if not (event.isApprovalFlow and is_preregistration):
            return JSONResponse(
                status_code=HTTPStatus.BAD_REQUEST,
                content={'message': 'Event is not open for pre-registration'},
            )

        # Check if the pre-registration with the same email already exists
        event_id = preregistration_in.eventId
        email = preregistration_in.email
        (
            status,
            preregistrations,
            message,
        ) = self.__preregistrations_repository.query_preregistrations_with_email(event_id=event_id, email=email)
        if status == HTTPStatus.OK and preregistrations:
            return JSONResponse(
                status_code=HTTPStatus.CONFLICT,
                content={'message': f'Pre-registration with email {email} already exists'},
            )

        preregistration_id = ulid.ulid()

        (
            status,
            preregistration,
            message,
        ) = self.__preregistrations_repository.store_preregistration(
            preregistration_in=preregistration_in, preregistration_id=preregistration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        preregistration_data = self.__convert_data_entry_to_dict(preregistration)

        if not preregistration.preRegistrationEmailSent:
            self.__email_usecase.send_preregistration_creation_email(preregistration=preregistration, event=event)

        preregistration_out = PreRegistrationOut(**preregistration_data)
        return preregistration_out

    def update_preregistration(
        self,
        event_id: str,
        preregistration_id: str,
        preregistration_in: PreRegistrationPatch,
    ) -> Union[JSONResponse, PreRegistrationOut]:
        """Updates an existing pre-registration entry.

        :param preregistration_id: The unique identifier of the pre-registration to be updated.
        :type preregistration_id: str

        :param preregistration_in: The data for updating the pre-registration.
        :type preregistration_in: PreRegistrationIn

        :return: If successful, returns the updated pre-registration entry. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, PreRegistrationOut]

        """
        status, event, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            preregistration,
            message,
        ) = self.__preregistrations_repository.query_preregistration_with_preregistration_id(
            event_id=event_id, preregistration_id=preregistration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            update_preregistration,
            message,
        ) = self.__preregistrations_repository.update_preregistration(
            preregistration_entry=preregistration, preregistration_in=preregistration_in
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        preregistration_data = self.__convert_data_entry_to_dict(update_preregistration)
        preregistration_out = PreRegistrationOut(**preregistration_data)

        return preregistration_out

    def get_preregistration(self, event_id: str, preregistration_id: str) -> Union[JSONResponse, PreRegistrationOut]:
        """Retrieves a specific pre-registration entry by its ID.

        :param event_id: The ID of the event
        :type event_id: str

        :param preregistration_id: The unique identifier of the pre-registration to be retrieved.
        :type preregistration_id: str

        :return: If found, returns the requested preregistration entry. If not found, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, PreRegistrationOut]

        """
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            preregistration,
            message,
        ) = self.__preregistrations_repository.query_preregistration_with_preregistration_id(
            event_id=event_id, preregistration_id=preregistration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        preregistration_data = self.__convert_data_entry_to_dict(preregistration)
        return PreRegistrationOut(**preregistration_data)

    def get_preregistration_by_email(self, event_id: str, email: str) -> PreRegistrationOut:
        """Retrieves a specific pre-registration entry by its email.

        :param event_id: The ID of the event
        :type event_id: str

        :param email: The email of the pre-registration to be retrieved.
        :type email: str

        :return: If found, returns the requested preregistration entry. If not found, returns a JSONResponse with an error message.
        :rtype: PreRegistrationOut

        """
        (
            status,
            preregistrations,
            message,
        ) = self.__preregistrations_repository.query_preregistrations_with_email(event_id=event_id, email=email)
        if status != HTTPStatus.OK or not preregistrations:
            return JSONResponse(status_code=status, content={'message': message})

        preregistration = preregistrations[0]
        preregistration_data = self.__convert_data_entry_to_dict(preregistration)

        return PreRegistrationOut(**preregistration_data)

    def get_preregistrations(self, event_id: str = None) -> Union[JSONResponse, List[PreRegistrationOut]]:
        """Retrieves a list of pre-registration preregistration_entries.

        :param event_id: If provided, only retrieves pre-registration entries for the specified event. If not provided, retrieves all pre-registration entries.
        :type event_id: str, optional

        :return: If successful, returns a list of pre-registration entries. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, List[PreRegistrationOut]]

        """
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            preregistrations,
            message,
        ) = self.__preregistrations_repository.query_preregistrations(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'messsage': message})

        return [
            PreRegistrationOut(**self.__convert_data_entry_to_dict(preregistration))
            for preregistration in preregistrations
        ]

    def delete_preregistration(self, event_id: str, preregistration_id: str) -> Union[None, JSONResponse]:
        """Deletes a specific preregistration entry by its ID.

        :param event_id: The ID of the event
        :type event_id: str

        :param preregistration_id: The unique identifier of the preregistration to be deleted.
        :type preregistration_id: str

        :return: If deleted successfully, returns None. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[None, JSONResponse]

        """
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            preregistration,
            message,
        ) = self.__preregistrations_repository.query_preregistration_with_preregistration_id(
            event_id=event_id, preregistration_id=preregistration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, message = self.__preregistrations_repository.delete_preregistration(
            preregistration_entry=preregistration
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return None

    def get_preregistration_csv(self, event_id: str) -> FileDownloadOut:
        """Returns the FileDownloadOut of the CSV for the specified event

        :param event_id: The event pre-registrations to be queried
        :type event_id: str

        :return: FileDownloadOut for the CSV
        :rtype: FileDownloadOut
        """
        # Get preregistrations for an event
        status, preregistrations, message = self.__preregistrations_repository.query_preregistrations(event_id=event_id)

        if status != HTTPStatus.OK:
            logger.error(message)
            return

        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                csv_path = os.path.join(tmpdir, 'preregistrations.csv')

                with open('preregistrations.csv', 'w') as temp:
                    writer = csv.writer(temp)

                    # make the first row csv for the keys
                    writer.writerow(preregistrations[0].get_attributes().keys())

                    # the remaining rows consist of the values of the attributes
                    for entry in preregistrations:
                        writer.writerow(entry.get_attributes().values())

                return self.__s3_usecase.create_download_url(csv_path)

        except Exception as e:
            logger.error(f'Error generating the CSV: {e}')
            return

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        """Converts a data entry to a dictionary.

        :param data_entry: The data entry to be converted.
        :type data_entry: Any

        :return: A dictionary representation of the data entry.
        :rtype: dict

        """
        return json.loads(data_entry.to_json())
