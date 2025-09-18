import csv
import os
import tempfile
from http import HTTPStatus
from typing import List, Union

import ulid
from model.events.events_constants import EventStatus
from model.file_uploads.file_upload import FileDownloadOut
from model.pycon_registrations.pycon_registration import (
    PyconRegistrationIn,
    PyconRegistrationOut,
    PyconRegistrationPatch,
)
from repository.events_repository import EventsRepository
from repository.payment_transaction_repository import PaymentTransactionRepository
from repository.registrations_repository import RegistrationsRepository
from repository.ticket_type_repository import TicketTypeRepository
from starlette.responses import JSONResponse
from usecase.discount_usecase import DiscountUsecase
from usecase.email_usecase import EmailUsecase
from usecase.file_s3_usecase import FileS3Usecase
from utils.logger import logger


class PyconRegistrationUsecase:
    """
    Handles the business logic for managing PyCon-specific registration entries.

    This class provides methods for creating, updating, retrieving, listing, and deleting PyCon registration entries.
    It focuses specifically on PyCon events and their unique requirements.

    Attributes:
        registrations_repository (RegistrationsRepository): An instance of the RegistrationsRepository used for data access.
    """

    def __init__(self):
        self.__registrations_repository = RegistrationsRepository()
        self.__events_repository = EventsRepository()
        self.__email_usecase = EmailUsecase()
        self.__discount_usecase = DiscountUsecase()
        self.__file_s3_usecase = FileS3Usecase()
        self.__ticket_type_repository = TicketTypeRepository()
        self.__payment_transaction_repository = PaymentTransactionRepository()

    def create_pycon_registration(
        self, registration_in: PyconRegistrationIn
    ) -> Union[JSONResponse, PyconRegistrationOut]:
        """Creates a new PyCon registration entry.

        :param registration_in: The data for creating the new PyCon registration.
        :type registration_in: PyconRegistrationIn

        :return: If successful, returns the created registration entry. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, PyconRegistrationOut]

        """
        logger.info(f'Saving PyCon registration: {registration_in}')
        status, event, message = self.__events_repository.query_events(event_id=registration_in.eventId)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_id = registration_in.eventId

        # Check if the event is still open
        if event.status != EventStatus.OPEN.value:
            return JSONResponse(
                status_code=HTTPStatus.BAD_REQUEST,
                content={'message': 'Event is not open for registration'},
            )

        is_free_ticket = False

        if event.paidEvent:
            if registration_in.discountCode:
                discount_entry = self.__discount_usecase.get_discount(
                    event_id=event_id, entry_id=registration_in.discountCode
                )
                if isinstance(discount_entry, JSONResponse):
                    return discount_entry

                if discount_entry.isReusable and discount_entry.remainingUses <= 0:
                    return JSONResponse(
                        status_code=HTTPStatus.BAD_REQUEST, content={'message': 'Discount code has no remaining uses'}
                    )

                if not discount_entry.isReusable and discount_entry.claimed:
                    return JSONResponse(
                        status_code=HTTPStatus.BAD_REQUEST,
                        content={'message': 'Discount code has already been claimed'},
                    )

                if discount_entry.discountPercentage == 1 and not registration_in.sprintDay:
                    is_free_ticket = True

            if not is_free_ticket:
                transaction_id = registration_in.transactionId
                if not transaction_id:
                    return JSONResponse(
                        status_code=HTTPStatus.BAD_REQUEST,
                        content={'message': 'Transaction ID is required for paid event'},
                    )

                (
                    status,
                    _,
                    message,
                ) = self.__payment_transaction_repository.query_payment_transaction_with_payment_transaction_id(
                    event_id=event_id, payment_transaction_id=transaction_id
                )
                if status != HTTPStatus.OK:
                    return JSONResponse(status_code=status, content={'message': message})

        # Check if the registration with the same email already exists
        email = registration_in.email
        (
            status,
            registrations,
            message,
        ) = self.__registrations_repository.query_registrations_with_email(event_id=event_id, email=email)
        if status == HTTPStatus.OK and registrations:
            logger.info(f'Registration with email {email} already exists, returning existing registration')
            registration = registrations[0]
            registration_data = self.__convert_data_entry_to_dict(registration)
            registration_out = PyconRegistrationOut(**registration_data)
            return self.collect_pre_signed_url_pycon(registration_out)

        # check if ticket types in event exists
        future_registrations = event.registrationCount
        if event.isLimitedSlot and future_registrations >= event.maximumSlots:
            # check if registration count in event is full
            return JSONResponse(
                status_code=HTTPStatus.BAD_REQUEST,
                content={'message': f'Event registration is full. Maximum slots: {event.maximumSlots}'},
            )

        if registration_in.sprintDay:
            if event.maximumSprintDaySlots and event.sprintDayRegistrationCount >= event.maximumSprintDaySlots:
                return JSONResponse(
                    status_code=HTTPStatus.BAD_REQUEST, content={'message': 'Sprint Day is already full.'}
                )

        ticket_type_entry = None
        if event.hasMultipleTicketTypes:
            ticket_type_id = registration_in.ticketType.value
            if not ticket_type_id:
                return JSONResponse(
                    status_code=HTTPStatus.BAD_REQUEST,
                    content={'message': 'Ticket type ID is required for multiple ticket types event'},
                )

            status, ticket_type_entry, message = self.__ticket_type_repository.query_ticket_type_with_ticket_type_id(
                event_id=event_id, ticket_type_id=ticket_type_id
            )
            if status != HTTPStatus.OK:
                return JSONResponse(status_code=status, content={'message': message})

            if ticket_type_entry.currentSales >= ticket_type_entry.maximumQuantity:
                return JSONResponse(
                    status_code=HTTPStatus.BAD_REQUEST,
                    content={'message': f'Ticket type {ticket_type_entry.name} is sold out'},
                )

        registration_id = ulid.ulid()
        discount_code = registration_in.discountCode
        if discount_code:
            claimed_discount = self.__discount_usecase.claim_discount(
                entry_id=discount_code,
                registration_id=registration_id,
                event_id=event_id,
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
            return JSONResponse(status_code=status, content={'message': message})

        status, __, message = self.__events_repository.append_event_registration_count(
            event_entry=event, registration_sprint_day=registration_in.sprintDay
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        if ticket_type_entry:
            status, __, message = self.__ticket_type_repository.append_ticket_type_sales(
                ticket_type_entry=ticket_type_entry
            )
            if status != HTTPStatus.OK:
                return JSONResponse(status_code=status, content={'message': message})

        registration_data = self.__convert_data_entry_to_dict(registration)

        if not registration.registrationEmailSent:
            self.__email_usecase.send_registration_creation_email(registration=registration, event=event)

        registration_out = PyconRegistrationOut(**registration_data)
        return self.collect_pre_signed_url_pycon(registration_out)

    def update_pycon_registration(
        self, event_id: str, registration_id: str, registration_in: PyconRegistrationPatch
    ) -> Union[JSONResponse, PyconRegistrationOut]:
        """Updates an existing PyCon registration entry.

        :param event_id: The ID of the event
        :type event_id: str

        :param registration_id: The unique identifier of the registration to be updated.
        :type registration_id: str

        :param registration_in: The data for updating the PyCon registration.
        :type registration_in: PyconRegistrationPatch

        :return: If successful, returns the updated registration entry. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, PyconRegistrationOut]

        """
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            registration,
            message,
        ) = self.__registrations_repository.query_registration_with_registration_id(
            event_id=event_id, registration_id=registration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            update_registration,
            message,
        ) = self.__registrations_repository.update_registration(
            registration_entry=registration, registration_in=registration_in
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        registration_data = self.__convert_data_entry_to_dict(update_registration)
        registration_out = PyconRegistrationOut(**registration_data)
        return self.collect_pre_signed_url_pycon(registration_out)

    def get_pycon_registration(self, event_id: str, registration_id: str) -> Union[JSONResponse, PyconRegistrationOut]:
        """Retrieves a specific PyCon registration entry by its ID.

        :param event_id: The ID of the event
        :type event_id: str

        :param registration_id: The unique identifier of the registration to be retrieved.
        :type registration_id: str

        :return: If found, returns the requested registration entry. If not found, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, PyconRegistrationOut]

        """

        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            registration,
            message,
        ) = self.__registrations_repository.query_registration_with_registration_id(
            event_id=event_id, registration_id=registration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        registration_data = self.__convert_data_entry_to_dict(registration)
        registration_out = PyconRegistrationOut(**registration_data)
        return self.collect_pre_signed_url_pycon(registration_out)

    def get_pycon_registration_by_email(self, event_id: str, email: str) -> Union[JSONResponse, PyconRegistrationOut]:
        """Retrieves a specific PyCon registration entry by its email.

        :param event_id: The ID of the event
        :type event_id: str

        :param email: The email of the registration to be retrieved.
        :type email: str

        :return: If found, returns the requested registration entry. If not found, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, PyconRegistrationOut]

        """
        (
            status,
            registrations,
            message,
        ) = self.__registrations_repository.query_registrations_with_email(event_id=event_id, email=email)
        if status != HTTPStatus.OK or not registrations:
            return JSONResponse(status_code=status, content={'message': message})

        registration = registrations[0]
        registration_data = self.__convert_data_entry_to_dict(registration)
        registration_out = PyconRegistrationOut(**registration_data)

        return self.collect_pre_signed_url_pycon(registration_out)

    def get_pycon_registrations(
        self, event_id: str = None, is_deleted: bool = False
    ) -> Union[JSONResponse, List[PyconRegistrationOut]]:
        """Retrieves a list of PyCon registration entries.

        :param event_id: If provided, only retrieves registration entries for the specified event. If not provided, retrieves all registration entries.
        :type event_id: str, optional

        :return: If successful, returns a list of registration entries. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, List[PyconRegistrationOut]]

        """
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            registrations,
            message,
        ) = self.__registrations_repository.query_registrations(event_id=event_id, is_deleted=is_deleted)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return [
            self.collect_pre_signed_url_pycon(PyconRegistrationOut(**self.__convert_data_entry_to_dict(registration)))
            for registration in registrations
        ]

    def get_pycon_registration_csv(self, event_id: str) -> FileDownloadOut:
        """Returns the FileDownloadOut of the CSV for the specified PyCon event

        :param event_id: The event registrations to be queried
        :type event_id: str

        :return: FileDownloadOut for the CSV
        :rtype: FileDownloadOut
        """
        # Get registrations for a PyCon event
        status, registrations, message = self.__registrations_repository.query_registrations(event_id=event_id)

        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                csv_path = os.path.join(tmpdir, 'pycon_registrations.csv')

                with open(csv_path, 'w') as temp:
                    writer = csv.writer(temp)

                    # make the first row csv for the keys using the dict keys of the first entry
                    first_entry = self.__convert_data_entry_to_dict(registrations[0])
                    writer.writerow(first_entry.keys())

                    # the remaining rows consist of the values of the attributes
                    for entry in registrations:
                        entry_dict = self.__convert_data_entry_to_dict(entry)
                        writer.writerow(entry_dict.values())

                # upload the file to s3
                csv_object_key = f'csv/pycon_registrations/{event_id}.csv'
                self.__file_s3_usecase.upload_file(file_name=csv_path, object_name=csv_object_key)

                return self.__file_s3_usecase.create_download_url(csv_object_key)

        except Exception as e:
            logger.error(f'Error generating the PyCon CSV for {event_id}: {e}')
            return

    def delete_pycon_registration(self, event_id: str, registration_id: str) -> Union[None, JSONResponse]:
        """Deletes a specific PyCon registration entry by its ID.

        :param event_id: The ID of the event
        :type event_id: str

        :param registration_id: The unique identifier of the registration to be deleted.
        :type registration_id: str

        :return: If deleted successfully, returns None. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[None, JSONResponse]

        """
        status, _, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (
            status,
            registration,
            message,
        ) = self.__registrations_repository.query_registration_with_registration_id(
            event_id=event_id, registration_id=registration_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, message = self.__registrations_repository.delete_registration(registration_entry=registration)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return None

    def collect_pre_signed_url_pycon(self, registration: PyconRegistrationOut) -> PyconRegistrationOut:
        """Collects the pre-signed URL for the valid ID image for PyCon registrations.

        :param registration: The PyCon registration entry to be updated.
        :type registration: PyconRegistrationOut

        :return: The updated registration entry with the pre-signed URL for the valid ID image.
        :rtype: PyconRegistrationOut

        """
        if registration.validIdObjectKey:
            image_id_url = self.__file_s3_usecase.create_download_url(registration.validIdObjectKey)
            registration.imageIdUrl = image_id_url.downloadLink

        return registration

    def resend_confirmation_email(self, event_id: str, email: str):
        """Resends the registration confirmation email for a specific PyCon registration entry.

        :param event_id: The ID of the event
        :type event_id: str

        :param email: The email address of the registrant
        :type email: str

        :return: If successful, returns a JSONResponse indicating the email was sent. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: JSONResponse

        """
        status, event, message = self.__events_repository.query_events(event_id=event_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        (status, registrations, message) = self.__registrations_repository.query_registrations_with_email(
            event_id=event_id, email=email
        )

        if status == HTTPStatus.OK and registrations and registrations[0].transactionId:
            registration = registrations[0]
            logger.info(f'Resending confirmation email to {email} for event {event_id}')
            self.__email_usecase.send_registration_creation_email(registration=registration, event=event)
            return JSONResponse(status_code=HTTPStatus.OK, content={'message': f'Confirmation email sent to {email}'})

        return JSONResponse(status_code=status, content={'message': message})

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        """Converts a data entry to a dictionary.

        :param data_entry: The data entry to be converted.
        :type data_entry: Any

        :return: A dictionary representation of the data entry.
        :rtype: dict

        """

        return data_entry.to_simple_dict()
