import json
from http import HTTPStatus
from typing import List, Union

import ulid
from model.events.events_constants import EventStatus
from model.registrations.registration import (
    RegistrationIn,
    RegistrationOut,
    RegistrationPatch,
)
from repository.events_repository import EventsRepository
from repository.registrations_repository import RegistrationsRepository
from starlette.responses import JSONResponse
from usecase.discount_usecase import DiscountUsecase
from usecase.email_usecase import EmailUsecase
from usecase.file_s3_usecase import FileS3Usecase


class RegistrationUsecase:
    """
    Handles the business logic for managing registration entries.

    This class provides methods for creating, updating, retrieving, listing, and deleting registration entries.

    Attributes:
        registrations_repository (RegistrationsRepository): An instance of the RegistrationsRepository used for data access.
    """

    def __init__(self):
        self.__registrations_repository = RegistrationsRepository()
        self.__events_repository = EventsRepository()
        self.__email_usecase = EmailUsecase()
        self.__discount_usecase = DiscountUsecase()
        self.__file_s3_usecase = FileS3Usecase()

    def create_registration(self, registration_in: RegistrationIn) -> Union[JSONResponse, RegistrationOut]:
        """
        Creates a new registration entry.

        Args:
            registration_in (RegistrationIn): The data for creating the new registration.

        Returns:
            Union[JSONResponse, RegistrationOut]: If successful, returns the created registration entry.
                If unsuccessful, returns a JSONResponse with an error message.
        """
        status, event, message = self.__events_repository.query_events(event_id=registration_in.eventId)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        # Check if the event is still open
        if event.status != EventStatus.OPEN.value:
            return JSONResponse(
                status_code=HTTPStatus.BAD_REQUEST,
                content={"message": "Event is not open for registration"},
            )

        # Check if the registration with the same email already exists
        event_id = registration_in.eventId
        email = registration_in.email
        (
            status,
            registrations,
            message,
        ) = self.__registrations_repository.query_registrations_with_email(event_id=event_id, email=email)
        if status == HTTPStatus.OK and registrations:
            return JSONResponse(
                status_code=HTTPStatus.CONFLICT,
                content={"message": f"Registration with email {email} already exists"},
            )

        registration_id = ulid.ulid()
        discount_code = registration_in.discountCode
        if discount_code:
            claimed_discount = self.__discount_usecase.claim_discount(
                entry_id=discount_code, registration_id=registration_id, event_id=event_id
            )
            if isinstance(claimed_discount, JSONResponse):
                return claimed_discount

        (
            status,
            registration,
            message,
        ) = self.__registrations_repository.store_registration(
            registration_in=registration_in, registration_id=registration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        registration_data = self.__convert_data_entry_to_dict(registration)
        self.__email_usecase.send_registration_creation_email(registration=registration, event=event)
        registration_out = RegistrationOut(**registration_data)
        return self.collect_pre_signed_url(registration_out)

    def update_registration(
        self, event_id: str, registration_id: str, registration_in: RegistrationPatch
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
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        (
            status,
            registration,
            message,
        ) = self.__registrations_repository.query_registrations(event_id=event_id, registration_id=registration_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        discount_code = registration_in.discountCode
        claimed_discount = self.__discount_usecase.claim_discount(
            entry_id=discount_code, registration_id=registration.registrationId, event_id=event_id
        )
        if isinstance(claimed_discount, JSONResponse):
            return claimed_discount

        (
            status,
            update_registration,
            message,
        ) = self.__registrations_repository.update_registration(
            registration_entry=registration, registration_in=registration_in
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        registration_data = self.__convert_data_entry_to_dict(update_registration)
        registration_out = RegistrationOut(**registration_data)
        return self.collect_pre_signed_url(registration_out)

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

        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        (
            status,
            registration,
            message,
        ) = self.__registrations_repository.query_registrations(event_id=event_id, registration_id=registration_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        registration_data = self.__convert_data_entry_to_dict(registration)
        registration_out = RegistrationOut(**registration_data)
        return self.collect_pre_signed_url(registration_out)

    def get_registration_by_email(self, event_id: str, email: str) -> RegistrationOut:
        status, registrations, message = self.__registrations_repository.query_registrations_with_email(
            event_id=event_id, email=email
        )
        if status != HTTPStatus.OK or not registrations:
            return JSONResponse(status_code=status, content={"message": message})
        registration = registrations[0]
        registration_data = self.__convert_data_entry_to_dict(registration)
        registration_out = RegistrationOut(**registration_data)
        return self.collect_pre_signed_url(registration_out)

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
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        (
            status,
            registrations,
            message,
        ) = self.__registrations_repository.query_registrations(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        return [
            self.collect_pre_signed_url(RegistrationOut(**self.__convert_data_entry_to_dict(registration)))
            for registration in registrations
        ]

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
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        (
            status,
            registration,
            message,
        ) = self.__registrations_repository.query_registrations(event_id=event_id, registration_id=registration_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        status, message = self.__registrations_repository.delete_registration(registration_entry=registration)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={"message": message})

        return None

    def collect_pre_signed_url(self, registration: RegistrationOut):
        if registration.gcashPayment:
            gcash_payment = self.__file_s3_usecase.create_download_url(registration.gcashPayment)
            registration.gcashPaymentUrl = gcash_payment.downloadLink

        return registration

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
