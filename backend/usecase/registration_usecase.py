import json
from http import HTTPStatus
from typing import List, Union

from model.registrations.registration import RegistrationIn, RegistrationOut
from repository.registrations_repository import RegistrationsRepository
from starlette.responses import JSONResponse


class RegistrationUsecase:
    """
    Handles the business logic for managing registration entries.

    This class provides methods for creating, updating, retrieving, listing, and deleting registration entries.

    Attributes:
        registrations_repository (RegistrationsRepository): An instance of the RegistrationsRepository used for data access.
    """

    def __init__(self):
        self.__registrations_repository = RegistrationsRepository()

    def create_registration(self, registration_in: RegistrationIn) -> Union[JSONResponse, RegistrationOut]:
        """
        Creates a new registration entry.

        Args:
            registration_in (RegistrationIn): The data for creating the new registration.

        Returns:
            Union[JSONResponse, RegistrationOut]: If successful, returns the created registration entry.
                If unsuccessful, returns a JSONResponse with an error message.
        """
        status, registration, message = self.__registrations_repository.store_registration(registration_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        registration_data = self.__convert_data_entry_to_dict(registration)
        return RegistrationOut(**registration_data)

    def update_registration(
        self, event_id: str, registration_id: str, registration_in: RegistrationIn
    ) -> Union[JSONResponse, RegistrationOut]:
        """
        Updates an existing registration entry.

        Args:
            registration_id (str): The unique identifier of the registration to be updated.
            registration_in (RegistrationIn): The data for updating the registration.

        Returns:
            Union[JSONResponse, RegistrationOut]: If successful, returns the updated registration entry.
                If unsuccessful, returns a JSONResponse with an error message.
        """
        status, registration, message = self.__registrations_repository.query_registrations(
            event_id=event_id, registration_id=registration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, update_registration, message = self.__registrations_repository.update_registration(
            registration_entry=registration, registration_in=registration_in
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        registration_data = self.__convert_data_entry_to_dict(update_registration)
        return RegistrationOut(**registration_data)

    def get_registration(self, event_id: str, registration_id: str) -> Union[JSONResponse, RegistrationOut]:
        """
        Retrieves a specific registration entry by its ID.

        Args:
            event_id (str): ID of the event
            registration_id (str): The unique identifier of the registration to be retrieved.

        Returns:
            Union[JSONResponse, RegistrationOut]: If found, returns the requested registration entry.
                If not found, returns a JSONResponse with an error message.
        """
        status, registration, message = self.__registrations_repository.query_registrations(
            event_id=event_id, registration_id=registration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        registration_data = self.__convert_data_entry_to_dict(registration)
        return RegistrationOut(**registration_data)

    def get_registrations(self, event_id: str = None) -> Union[JSONResponse, List[RegistrationOut]]:
        """
        Retrieves a list of registration eregistration_idntries.

        Args:
            event_id (str, optional): If provided, only retrieves registration entries for the specified event.
                If not provided, retrieves all registration entries.

        Returns:
            Union[JSONResponse, List[RegistrationOut]]: If successful, returns a list of registration entries.
                If unsuccessful, returns a JSONResponse with an error message.
        """
        status, registrations, message = self.__registrations_repository.query_registrations(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return [RegistrationOut(**self.__convert_data_entry_to_dict(registration)) for registration in registrations]

    def delete_registration(self, event_id: str, registration_id: str) -> Union[None, JSONResponse]:
        """
        Deletes a specific registration entry by its ID.

        Args:
            event_id: The ID of the event
            registration_id (str): The unique identifier of the registration to be deleted.

        Returns:
            Union[None, JSONResponse]: If deleted successfully, returns None.
                If unsuccessful, returns a JSONResponse with an error message.
        """
        status, registration, message = self.__registrations_repository.query_registrations(
            event_id=event_id, registration_id=registration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, message = self.__registrations_repository.delete_registration(registration_entry=registration)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return None

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
