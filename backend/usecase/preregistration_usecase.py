import json
from http import HTTPStatus
from typing import List, Union

import ulid
from model.events.events_constants import EventStatus
from model.preregistrations.preregistrations_constants import AcceptanceStatus
from model.preregistrations.preregistration import (
    PreRegistrationIn,
    PreRegistrationOut,
    PreRegistrationPatch,
)
from repository.events_repository import EventsRepository
from repository.preregistrations_repository import PreRegistrationsRepository
from starlette.responses import JSONResponse
from usecase.discount_usecase import DiscountUsecase
from usecase.email_usecase import EmailUsecase
from usecase.file_s3_usecase import FileS3Usecase


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
        self.__discount_usecase = DiscountUsecase()
        self.__file_s3_usecase = FileS3Usecase()

    def create_preregistration(self, preregistration_in: PreRegistrationIn) -> Union[JSONResponse, PreRegistrationOut]:
        """
        Creates a new pre-registration entry.

        Args:
            pre-registration_in (PreRegistrationIn): The data for creating the new pre-registration.

        Returns:
            Union[JSONResponse, PreRegistrationOut]: If successful, returns the created pre-registration entry.
                If unsuccessful, returns a JSONResponse with an error message.
        """
        status, event, message = self.__events_repository.query_events(event_id=preregistration_in.eventId)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        # Check if the event is still open
        if not event.isApprovalFlow:
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
        self, event_id: str, preregistration_id: str, preregistration_in: PreRegistrationPatch
    ) -> Union[JSONResponse, PreRegistrationOut]:
        """
        Updates an existing pre-registration entry.

        Args:
            preregistration_id (str): The unique identifier of the pre-registration to be updated.
            preregistration_in (PreRegistrationIn): The data for updating the pre-registration.

        Returns:
            Union[JSONResponse, PreRegistrationOut]: If successful, returns the updated pre-registration entry.
                If unsuccessful, returns a JSONResponse with an error message.
        """
        status, event, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            preregistration,
            message,
        ) = self.__preregistrations_repository.query_preregistrations(event_id=event_id, preregistration_id=preregistration_id)
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

        if update_preregistration.acceptanceStatus == AcceptanceStatus.ACCEPTED and not update_preregistration.acceptanceEmailSent:
            self.__email_usecase.send_preregistration_acceptance_email(preregistration=update_preregistration, event=event)

        preregistration_data = self.__convert_data_entry_to_dict(update_preregistration)
        preregistration_out = PreRegistrationOut(**preregistration_data)

        return preregistration_out

    def get_preregistration(self, event_id: str, preregistration_id: str) -> Union[JSONResponse, PreRegistrationOut]:
        """
        Retrieves a specific pre-registration entry by its ID.

        Args:
            event_id (str): ID of the event
            preregistration_id (str): The unique identifier of the pre-registration to be retrieved.

        Returns:
            Union[JSONResponse, PreRegistrationOut]: If found, returns the requested preregistration entry.
                If not found, returns a JSONResponse with an error message.
        """

    def get_preregistration_by_email(self, event_id: str, email: str) -> PreRegistrationOut:
        (
            status,
            preregistrations,
            message,
        ) = self.__preregistrations_repository.query_preregistrations_with_email(event_id=event_id, email=email)
        if status != HTTPStatus.OK or not preregistrations:
            return JSONResponse(status_code=status, content={'message': message})

        preregistration = preregistrations[0]
        preregistration_data = self.__convert_data_entry_to_dict(preregistration)
        preregistration_out = PreRegistrationOut(**preregistration_data)

        return preregistration_out

    def get_preregistrations(self, event_id: str = None) -> Union[JSONResponse, List[PreRegistrationOut]]:

        """
        Retrieves a list of pre-registration preregistration_entries.

        Args: 
            event_id (str,optional): If provided, only retrieves pre-registration entries for the specified event.
                If not provided, retrieves all pre-registration entries.

        Returns:
            Union[JSONResponse, List[PreRegistrationOut]]: If successful, returns a list of pre-registration entries.
                If unsuccessful, returns a JSONResponse with an error message. 
        """
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message':message})

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

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        """
        Converts a data entry to a dictionary.

        Args:
            data_entry: The data entry to be converted.

        Returns:
            dict: A dictionary representation of the data entry.
        """
        return json.loads(data_entry.to_json())
