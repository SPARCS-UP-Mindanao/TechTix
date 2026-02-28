import csv
import os
import tempfile
from datetime import datetime
from http import HTTPStatus
from typing import List, Union

import ulid
from constants.common_constants import CommonConstants
from external_gateway.konfhub_gateway import KonfHubGateway
from model.events.event import Event
from model.events.events_constants import EventStatus
from model.file_uploads.file_upload import FileDownloadOut
from model.konfhub.konfhub import KonfHubCaptureRegistrationIn, RegistrationDetail
from model.registrations.registration import (
    PreRegistrationToRegistrationIn,
    Registration,
    RegistrationIn,
    RegistrationOut,
)
from repository.events_repository import EventsRepository
from repository.payment_transaction_repository import PaymentTransactionRepository
from repository.registrations_repository import RegistrationsRepository
from repository.ticket_type_repository import TicketTypeRepository
from starlette.responses import JSONResponse
from usecase.discount_usecase import DiscountUsecase
from usecase.email_usecase import EmailUsecase
from usecase.file_s3_usecase import FileS3Usecase
from usecase.preregistration_usecase import PreRegistrationUsecase
from utils.logger import logger
from backend.utils.pii.pii_masking import mask_email


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
        self.__preregistration_usecase = PreRegistrationUsecase()
        self.__ticket_type_repository = TicketTypeRepository()
        self.__konfhub_gateway = KonfHubGateway()
        self.__payment_transaction_repository = PaymentTransactionRepository()

    def create_registration(self, registration_in: RegistrationIn) -> Union[JSONResponse, RegistrationOut]:
        """Creates a new registration entry.

        :param registration_in: The data for creating the new registration.
        :type registration_in: RegistrationIn

        :return: If successful, returns the created registration entry. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, RegistrationOut]

        """
        status, event, message = self.__events_repository.query_events(event_id=registration_in.eventId)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        event_id = registration_in.eventId

        if event.isApprovalFlow:
            return self.create_registration_approval_flow(event=event, registration_in=registration_in)

        # Check if the event is still open
        if event.status != EventStatus.OPEN.value:
            return JSONResponse(
                status_code=HTTPStatus.BAD_REQUEST,
                content={'message': 'Event is not open for registration'},
            )

        if event.paidEvent:
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
            logger.info(f'Registration with email {mask_email(email)} already exists, returning existing registration')            
            registration = registrations[0]
            registration_data = self.__convert_data_entry_to_dict(registration)
            registration_out = RegistrationOut(**registration_data)
            return self.collect_pre_signed_url(registration_out)

        # check if ticket types in event exists
        future_registrations = event.registrationCount
        if event.isLimitedSlot and future_registrations >= event.maximumSlots:
            # check if registration count in event is full
            return JSONResponse(
                status_code=HTTPStatus.BAD_REQUEST,
                content={'message': f'Event registration is full. Maximum slots: {event.maximumSlots}'},
            )

        ticket_type_entry = None
        if event.hasMultipleTicketTypes:
            ticket_type_id = registration_in.ticketTypeId
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

        status, __, message = self.__events_repository.append_event_registration_count(event_entry=event)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        if ticket_type_entry:
            status, __, message = self.__ticket_type_repository.append_ticket_type_sales(
                ticket_type_entry=ticket_type_entry
            )
            if status != HTTPStatus.OK:
                return JSONResponse(status_code=status, content={'message': message})

        # Capture registration to KonfHub
        if event.konfhubId:
            konfhub_response = self.register_konfhub(registration_in=registration_in, event_id=event_id, event=event)
            if konfhub_response != HTTPStatus.OK:
                return konfhub_response

        registration_data = self.__convert_data_entry_to_dict(registration)

        if not registration.registrationEmailSent:
            self.__email_usecase.send_registration_creation_email(registration=registration, event=event)

        registration_out = RegistrationOut(**registration_data)
        return self.collect_pre_signed_url(registration_out)

    def create_registration_approval_flow(
        self, event: Event, registration_in: RegistrationIn
    ) -> Union[JSONResponse, RegistrationOut]:
        """Creates a new registration entry for an event with approval flow.

        :param event: The event for which the registration is being created.
        :type event: Event

        :param registration_in: The data for creating the new registration.
        :type registration_in: RegistrationIn

        :return: If successful, returns the created registration entry. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, RegistrationOut]

        """
        event_id = registration_in.eventId
        email = registration_in.email
        preregistration = self.__preregistration_usecase.get_preregistration_by_email(event_id=event_id, email=email)

        if isinstance(preregistration, JSONResponse):
            return preregistration

        registration_data = preregistration.dict()
        registration_data_in = PreRegistrationToRegistrationIn(
            **registration_data,
            discountCode=registration_in.discountCode,
            referenceNumber=registration_in.referenceNumber,
            amountPaid=registration_in.amountPaid,
        )

        registration_id = preregistration.preRegistrationId
        (
            status,
            registration,
            message,
        ) = self.__registrations_repository.store_registration(
            registration_in=registration_data_in,
            registration_id=registration_id,
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        status, __, message = self.__events_repository.append_event_registration_count(event_entry=event)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        if event.konfhubId:
            konfhub_response = self.register_konfhub(registration_in=registration_in, event_id=event_id, event=event)
            if konfhub_response != HTTPStatus.OK:
                return konfhub_response

        registration_data = self.__convert_data_entry_to_dict(registration)

        if not registration.registrationEmailSent:
            self.__email_usecase.send_registration_creation_email(registration=registration, event=event)

        registration_out = RegistrationOut(**registration_data)
        return self.collect_pre_signed_url(registration_out)

    def update_registration(
        self, event_id: str, registration_id: str, registration_in: RegistrationIn
    ) -> Union[JSONResponse, RegistrationOut]:
        """Updates an existing registration entry.

        :param registration_id: The unique identifier of the registration to be updated.
        :type registration_id: str

        :param registration_in: The data for updating the registration.
        :type registration_in: PyconRegistrationIn

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
        registration_out = RegistrationOut(**registration_data)
        return self.collect_pre_signed_url(registration_out)

    def get_registration(self, event_id: str, registration_id: str) -> Union[JSONResponse, RegistrationOut]:
        """Retrieves a specific registration entry by its ID.

        :param event_id: The ID of the event
        :type event_id: str

        :param registration_id: The unique identifier of the registration to be retrieved.
        :type registration_id: str

        :return: If found, returns the requested registration entry. If not found, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, RegistrationOut]

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
        registration_out = RegistrationOut(**registration_data)
        return self.collect_pre_signed_url(registration_out)

    def get_registration_by_email(self, event_id: str, email: str) -> RegistrationOut:
        """Retrieves a specific registration entry by its email.

        :param event_id: The ID of the event
        :type event_id: str

        :param email: The email of the registration to be retrieved.
        :type email: str

        :return: If found, returns the requested registration entry. If not found, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, RegistrationOut]

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
        registration_out = RegistrationOut(**registration_data)

        return self.collect_pre_signed_url(registration_out)

    def get_registrations(
        self, event_id: str = None, is_deleted: bool = False
    ) -> Union[JSONResponse, List[RegistrationOut]]:
        """Retrieves a list of registration eregistration_idntries.

        :param event_id: If provided, only retrieves registration entries for the specified event. If not provided, retrieves all registration entries.
        :type event_id: str, optional

        :return: If successful, returns a list of registration entries. If unsuccessful, returns a JSONResponse with an error message.
        :rtype: Union[JSONResponse, List[RegistrationOut]

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
            self.collect_pre_signed_url(RegistrationOut(**self.__convert_data_entry_to_dict(registration)))
            for registration in registrations
        ]

    def get_registration_csv(self, event_id: str) -> FileDownloadOut:
        """Returns the FileDownloadOut of the CSV for the specified event

        :param event_id: The event registrations to be queried
        :type event_id: str

        :return: FileDownloadOut for the CSV
        :rtype: FileDownloadOut
        """
        # Get preregistrations for an event
        status, registrations, message = self.__registrations_repository.query_registrations(event_id=event_id)

        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        if not registrations:
            return JSONResponse(
                status_code=HTTPStatus.NOT_FOUND, content={'message': 'No registrations found for this event'}
            )

        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                csv_path = os.path.join(tmpdir, 'registrations.csv')

                with open(csv_path, 'w') as temp:
                    writer = csv.writer(temp)

                    # Get headers from Registration DynamoDB model attributes
                    all_headers = [
                        attr_name
                        for attr_name in dir(Registration)
                        if not attr_name.startswith('_')
                        and not callable(getattr(Registration, attr_name))
                        and attr_name not in ['Meta', 'DoesNotExist', 'registrationIdGSI', 'emailLSI']
                    ]

                    priority_headers = ['firstName', 'lastName']
                    remaining_headers = [h for h in all_headers if h not in priority_headers]
                    remaining_headers.sort()

                    headers = priority_headers + remaining_headers
                    logger.info(f'Headers for CSV export: {headers}')
                    writer.writerow(headers)

                    for entry in registrations:
                        entry_dict = self.__convert_data_entry_to_dict(entry)
                        row_values = [entry_dict.get(header, '') for header in headers]
                        writer.writerow(row_values)

                # upload the file to s3
                csv_object_key = f'csv/registrations/{event_id}-{datetime.now().strftime("%Y%m%d%H%M%S")}.csv'
                self.__file_s3_usecase.upload_file(file_name=csv_path, object_name=csv_object_key)

                return self.__file_s3_usecase.create_download_url(csv_object_key)

        except Exception as e:
            logger.error(f'Error generating the CSV for {event_id}: {e}')
            return

    def delete_registration(self, event_id: str, registration_id: str) -> Union[None, JSONResponse]:
        """Deletes a specific registration entry by its ID.

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

    def collect_pre_signed_url(self, registration: RegistrationOut) -> RegistrationOut:
        """Collects the pre-signed URL for the GCash payment image.

        :param registration: The registration entry to be updated.
        :type registration: RegistrationOut

        :return: The updated registration entry with the pre-signed URL for the GCash payment image.
        :rtype: RegistrationOut

        """
        if registration.gcashPaymentId:
            image_id_url = self.__file_s3_usecase.create_download_url(registration.gcashPaymentId)
            registration.gcashPaymentUrl = image_id_url.downloadLink

        return registration

    def collect_pre_signed_url_pycon(self, registration: RegistrationOut) -> RegistrationOut:
        """Collects the pre-signed URL for the valid ID image.

        :param registration: The registration entry to be updated.
        :type registration: PyconRegistrationOut

        :return: The updated registration entry with the pre-signed URL for the GCash payment image.
        :rtype: PyconRegistrationOut

        """
        if registration.validIdObjectKey:
            image_id_url = self.__file_s3_usecase.create_download_url(registration.validIdObjectKey)
            registration.imageIdUrl = image_id_url.downloadLink

        return registration

    def register_konfhub(self, registration_in: RegistrationIn, event_id: str, event: Event):
        ticket_type_id = registration_in.ticketTypeId
        if not ticket_type_id:
            _, ticket_types_entries, _ = self.__ticket_type_repository.query_ticket_types(event_id=event_id)
            ticket_types_list = [ticket_type.konfhubId for ticket_type in ticket_types_entries or []]
            ticket_type_id = ticket_types_list[0]

        phone_number_with_no_zero = registration_in.contactNumber.lstrip('0')
        konfhub_registration_details = RegistrationDetail(
            name=f'{registration_in.firstName} {registration_in.lastName}',
            email_id=registration_in.email,
            quantity=1,
            designation=registration_in.title,
            organisation=registration_in.organization,
            t_shirt_size=registration_in.shirtSize,
            phone_number=phone_number_with_no_zero,
            dial_code=CommonConstants.PH_DIAL_CODE,
            country_code=CommonConstants.PH_COUNTRY_CODE,
        )
        konfhub_capture_registration_in = KonfHubCaptureRegistrationIn(
            event_id=event.konfhubId,
            registration_tz=CommonConstants.PH_TIMEZONE,
            registration_details={
                ticket_type_id: [konfhub_registration_details],
            },
        )
        status, _, message = self.__konfhub_gateway.capture_registration(
            konfhub_capture_registration_in, event.konfhubApiKey
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        return status

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        """Converts a data entry to a dictionary.

        :param data_entry: The data entry to be converted.
        :type data_entry: Any

        :return: A dictionary representation of the data entry.
        :rtype: dict

        """

        return data_entry.to_simple_dict()
