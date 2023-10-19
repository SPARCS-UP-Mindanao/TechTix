import json 
from http import HTTPStatus
from typing import List, Union

from model.registrations.registration import RegistrationIn, RegistrationOut
from repository.registrations_repository import RegistrationsRepository
from starlette.responses import JSONResponse

"""
The `RegistrationUsecase` class serves as the intermediary layer between the API endpoints and the underlying data
repository for registration management. It encapsulates business logic related to registration operations and
interacts with the `RegistrationsRepository` to perform data storage, retrieval, updating, and deletion.

Methods:
    - create_registration(registration_in: RegistrationIn) -> Union[JSONResponse, RegistrationOut]:
        Creates a new registration record based on the provided data.

    - update_registration(registration_id: str, registration_in: RegistrationIn) -> Union[JSONResponse, RegistrationOut]:
        Updates an existing registration record identified by its unique ID with new data.

    - get_registration(registration_id: str) -> Union[JSONResponse, RegistrationOut]:
        Retrieves a specific registration record by its unique ID.

    - get_registrations() -> Union[JSONResponse, List[RegistrationOut]]:
        Retrieves a list of all registration records.

    - delete_registration(registration_id: str) -> Union[None, JSONResponse]:
        Deletes a registration record identified by its unique ID.

Private Methods:
    - __convert_data_entry_to_dict(data_entry): Converts a data entry object into a dictionary representation.

This class ensures proper error handling and returns HTTP responses or data models as needed. It acts as an
abstraction layer for the registration-related business logic, making it easier to manage and maintain the codebase.
"""
class RegistrationUsecase:
    def __init__(self):
        self.__registrations_repository = RegistrationsRepository()

    def create_registration(self, registration_in: RegistrationIn) -> Union[JSONResponse, RegistrationOut]:
        status, registration, message = self.__registrations_repository.store_registration(registration_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})
        registration_data = self.__convert_data_entry_to_dict(registration)
        return RegistrationOut(**registration_data)

    def update_registration(self, registration_id: str, registration_in: RegistrationIn) -> Union[JSONResponse, RegistrationOut]:
        status, registration, message = self.__registrations_repository.query_registrations(registration_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, update_registration, message = self.__registrations_repository.update_registration(registration_entry=registration, registration_in=registration_in)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        registration_data = self.__convert_data_entry_to_dict(update_registration)
        return RegistrationOut(**registration_data)

    def get_registration(self, registration_id: str) -> Union[JSONResponse, RegistrationOut]:
        status, registration, message = self.__registrations_repository.query_registrations(registration_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        registration_data = self.__convert_data_entry_to_dict(registration)
        return RegistrationOut(**registration_data)

    def get_registrations(self) -> Union[JSONResponse, List[RegistrationOut]]:
        status, registrations, message = self.__registrations_repository.query_registrations()
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        registrations_data = [self.__convert_data_entry_to_dict(registration) for registration in registrations]
        return [RegistrationOut(**registration_data) for registration_data in registrations_data]

    def delete_registration(self, registration_id: str) -> Union[None, JSONResponse]:
        status, registration, message = self.__registrations_repository.query_registrations(registration_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, message = self.__registrations_repository.delete_registration(registration_entry=registration)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return None

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        return json.loads(data_entry.to_json())
