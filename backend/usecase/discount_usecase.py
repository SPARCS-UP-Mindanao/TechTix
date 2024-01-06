import json
import random
import string
from http import HTTPStatus
from typing import List, Union

from model.discount.discount import (
    DiscountDBIn,
    DiscountIn,
    DiscountOrganization,
    DiscountOut,
)
from repository.discount_repository import DiscountsRepository
from repository.events_repository import EventsRepository
from repository.registrations_repository import RegistrationsRepository
from starlette.responses import JSONResponse
from utils.utils import Utils


class DiscountUsecase:
    def __init__(self):
        self.__discounts_repository = DiscountsRepository()
        self.__events_repository = EventsRepository()
        self.__registrations_repository = RegistrationsRepository()

    def get_discount(self, event_id: str, entry_id: str) -> DiscountOut:
        status, discount, message = self.__discounts_repository.query_discounts(event_id=event_id, discount_id=entry_id)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        discount_data = self.__convert_data_entry_to_dict(discount)
        discount_out = DiscountOut(**discount_data)

        if discount.registrationId:
            (
                _,
                registration_entry,
                _,
            ) = self.__registrations_repository.query_registrations(
                event_id=event_id, registration_id=discount.registrationId
            )
            if not registration_entry:
                return discount_out

            registration_data = self.__convert_data_entry_to_dict(registration_entry)
            discount_out.registration = registration_data

        return discount_out

    def get_discount_list(self, event_id: str) -> List[DiscountOrganization]:
        status, discounts, message = self.__discounts_repository.query_discounts(
            event_id=event_id,
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        discount_map = {}
        for discount in discounts:
            discount_data = self.__convert_data_entry_to_dict(discount)
            discount_out = DiscountOut(**discount_data)

            if discount.registrationId:
                (
                    _,
                    registration_entry,
                    _,
                ) = self.__registrations_repository.query_registrations(
                    event_id=event_id, registration_id=discount.registrationId
                )
                if registration_entry:
                    registration_data = self.__convert_data_entry_to_dict(registration_entry)
                    discount_out.registration = registration_data

            discount_out_list = discount_map.get(discount_out.organizationId) or []
            discount_out_list.append(discount_out)
            discount_map[discount_out.organizationId] = discount_out_list

        return [
            DiscountOrganization(
                organizationId=organization_id,
                discounts=discount_out_list,
            )
            for organization_id, discount_out_list in discount_map.items()
        ]

    def claim_discount(self, event_id: str, entry_id: str, registration_id: str):
        status, discount_entry, message = self.__discounts_repository.query_discounts(
            discount_id=entry_id, event_id=event_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(
                status_code=HTTPStatus.BAD_REQUEST,
                content={'message': 'Discount Does Not Exist'},
            )

        if discount_entry.claimed:
            return JSONResponse(
                status_code=HTTPStatus.BAD_REQUEST,
                content={'message': 'Discount already claimed'},
            )

        discount_data = self.__convert_data_entry_to_dict(discount_entry)
        discount_data.update(claimed=True)
        discount_data.update(registrationId=registration_id)

        discount_in = DiscountDBIn(
            **discount_data,
        )
        status, discount, message = self.__discounts_repository.update_discount(
            discount_entry=discount_entry, discount_in=discount_in
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})

        discount_data = self.__convert_data_entry_to_dict(discount)
        return DiscountOut(**discount_data)

    def create_discounts(self, discount_in: DiscountIn) -> Union[JSONResponse, List[DiscountOut]]:
        status, _, __ = self.__events_repository.query_events(discount_in.eventId)
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': 'Event does not exist'})

        discount_list = []
        organization_id = Utils.convert_to_slug(discount_in.organizationName)
        for _ in range(discount_in.quantity):
            discount_in = DiscountDBIn(
                organizationId=organization_id,
                eventId=discount_in.eventId,
                claimed=False,
                registrationId=None,
                discountPercentage=discount_in.discountPercentage,
                entryId=self.__generate_discount_code(),
            )

            status, discount, message = self.__discounts_repository.store_discount(discount_in=discount_in)
            if status != HTTPStatus.OK:
                return JSONResponse(status_code=status, content={'message': message})

            discount_data = self.__convert_data_entry_to_dict(discount)
            discount_out = DiscountOut(**discount_data)
            discount_list.append(discount_out)

        return discount_list

    def __generate_discount_code(self, length=8):
        characters = string.ascii_uppercase + string.digits
        return ''.join(random.choice(characters) for _ in range(length))

    @staticmethod
    def __convert_data_entry_to_dict(data_entry):
        return json.loads(data_entry.to_json())
