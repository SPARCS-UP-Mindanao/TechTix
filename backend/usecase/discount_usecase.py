
import json
import random
import string

from http import HTTPStatus
from typing import List, Union

from model.discount.discount import DiscountIn, DiscountOut, DiscountDBIn
from repository.events_repository import EventsRepository
from repository.discount_repository import DiscountsRepository
from starlette.responses import JSONResponse


class DiscountUsecase:
    def __init__(self):
        self.__discounts_repository = DiscountsRepository()
        self.__events_repository = EventsRepository()

    def get_discount(self, entry_id: str) -> DiscountOut:
        status, discount, message = self.__discounts_repository.query_discounts(
            discount_id=entry_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})
        
        discount_data = self.__convert_data_entry_to_dict(discount)
        return DiscountOut(**discount_data)
    
    
    def claim_discount(self, entry_id: str, registration_id: str):
        status, discount_entry, message = self.__discounts_repository.query_discounts(
            discount_id=entry_id
        )
        if status != HTTPStatus.OK:
            return JSONResponse(status_code=status, content={'message': message})
        
        if discount_entry.claimed:
            return JSONResponse(status_code=HTTPStatus.BAD_REQUEST, content={'message': 'Discount already claimed'})

        discount_data = self.__convert_data_entry_to_dict(discount_entry)
        discount_data.update(claimed=True)
        discount_data.update(registrationId=registration_id)

        discount_in = DiscountDBIn(
            **discount_data,
        )
        status, discount, message = self.__discounts_repository.update_discount(
            discount_entry=discount_entry,
            discount_in=discount_in
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
        for _ in range(discount_in.quantity):
            discount_in = DiscountDBIn(
                eventId=discount_in.eventId,
                claimed=False,
                registrationId=None,
                discountPercentage=discount_in.discountPercentage,
                entryId= self.__generate_discount_code(),
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
