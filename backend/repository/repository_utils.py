import json
from copy import deepcopy
from typing import Tuple

from constants.common_constants import CommonConstants
from pynamodb.attributes import MapAttribute
from pynamodb.models import Model


class RepositoryUtils:
    @staticmethod
    def get_update(old_data: dict, new_data: dict) -> Tuple[bool, dict]:
        excluded_comparison_keys = deepcopy(CommonConstants.EXCLUDE_COMPARISON_KEYS)

        # copy old_data
        old_data_copy = deepcopy(old_data)
        for key in excluded_comparison_keys:
            old_data_copy.pop(key, None)

        # set updated_data
        updated_data = deepcopy(old_data_copy)
        RepositoryUtils.update_nested_dict(updated_data, new_data)
        has_update = updated_data != old_data_copy

        # Change to MapAttribute
        updated_data = RepositoryUtils.items_to_map_attr(updated_data)

        return has_update, updated_data

    @staticmethod
    def update_nested_dict(old_dict: dict, new_data: dict):
        for key, val in new_data.items():
            if isinstance(val, dict):
                try:
                    RepositoryUtils.update_nested_dict(old_dict[key], val)
                except KeyError:
                    old_dict[key] = {}
                    RepositoryUtils.update_nested_dict(old_dict[key], val)
            elif val is not None or key in old_dict:
                old_dict[key] = val

        return old_dict

    @staticmethod
    def items_to_map_attr(hub_dict: dict) -> dict:
        tmp_dict = {}
        for key, val in hub_dict.items():
            if isinstance(val, dict):
                new_dict = RepositoryUtils.items_to_map_attr(val)
                tmp_dict[key] = MapAttribute(**new_dict)
            else:
                tmp_dict[key] = val
        return tmp_dict

    @staticmethod
    def db_model_to_dict(model: Model) -> dict:
        json_str = model.to_json()
        hub_dict = json.loads(json_str)
        return hub_dict

    @staticmethod
    def load_data(pydantic_schema_in, exclude_unset=False):
        return json.loads(pydantic_schema_in.json(exclude_unset=exclude_unset))
