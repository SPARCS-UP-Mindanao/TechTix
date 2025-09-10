import argparse
import os
from copy import deepcopy

from dotenv import load_dotenv
from typing_extensions import Literal

script_dir = os.path.dirname(os.path.abspath(__file__))
args = argparse.ArgumentParser()
args.add_argument('--env-file', type=str, default=os.path.join(script_dir, '..', '.env'), help='Path to the .env file')
load_dotenv(dotenv_path=args.parse_args().env_file)

from model.discount.discount import DiscountDBIn
from repository.discount_repository import DiscountsRepository
from utils.logger import logger


def change_discount_code_uses(
    event_id: str, discount_id: str, uses_change: int, operation: Literal['add', 'deduct']
) -> None:
    """
    Adjusts the max usage of a reusable discount code.

    Args:
        event_id (str): The ID of the event.
        discount_id (str): The ID of the discount code.
        uses_change (int): The number of uses to add or deduct. Must be a positive integer.
        operation (Literal['add', 'deduct']): The type of operation to perform.
    """
    discount_repository = DiscountsRepository()
    status, discount_entry, message = discount_repository.query_discount_with_discount_id(
        event_id=event_id, discount_id=discount_id
    )

    if not status:
        logger.error(f"Error changing uses of discount code '{discount_id}' for event '{event_id}'. {message}")
        return

    original_discount_entry = deepcopy(discount_entry)

    if not discount_entry.isReusable:
        logger.warning(f"Discount code '{discount_id}' is not reusable. Cannot change max uses.")
        return

    if uses_change < 0:
        logger.error('`uses_change` must be a non-negative integer.')
        return

    new_max_uses = 0
    if operation == 'add':
        new_max_uses = discount_entry.maxDiscountUses + uses_change
    elif operation == 'deduct':
        new_max_uses = discount_entry.maxDiscountUses - uses_change

        if new_max_uses < discount_entry.currentDiscountUses:
            logger.error(
                f'Cannot deduct {uses_change} uses. The new max uses ({new_max_uses}) would be less than the current uses ({discount_entry.currentDiscountUses}).'
            )
            return
    else:
        logger.error(f"Invalid operation '{operation}'. Must be 'add' or 'deduct'.")
        return

    discount_entry.maxDiscountUses = new_max_uses
    discount_entry.remainingUses = new_max_uses - discount_entry.currentDiscountUses

    logger.info(
        f"Changed max uses for discount code '{discount_id}' for event '{event_id}' from {original_discount_entry.maxDiscountUses} to {discount_entry.maxDiscountUses}."
    )

    if discount_entry:
        discount_repository.update_discount(
            discount_entry=original_discount_entry, discount_in=DiscountDBIn(**discount_entry.attribute_values)
        )


if __name__ == '__main__':
    event_id = 'test-event-id'
    entry_id = 'test-entry-id'
    uses = 50
    change_discount_code_uses(event_id=event_id, discount_id=entry_id, uses_change=uses, operation='deduct')
