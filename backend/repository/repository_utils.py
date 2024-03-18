import json
from copy import deepcopy
from typing import Tuple

from constants.common_constants import CommonConstants
from pynamodb.attributes import MapAttribute
from pynamodb.models import Model


class RepositoryUtils:
    @staticmethod
    def get_update(old_data: dict, new_data: dict) -> Tuple[bool, dict]:
        """Get the updated data and check if there's an update.
        
        :param old_data: The old data to be compared with the new data.
        :type old_data: dict
        
        :param new_data: The new data to be that will be used as basis for comparison.
        :type new_data: dict
        
        :return: A tuple containing a boolean value indicating if there's an update and the updated data.
        :rtype: Tuple[bool, dict]

        """
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
        """Update nested dictionary with new data

        :param old_dict: The old dictionary to be updated with new data.
        :type old_dict: dict
        
        :param new_data: The new data to be added or changed in the old dictionary.
        :type new_data: dict
        
        :return: The updated dictionary.
        :rtype: dict
            
        """
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
        """Convert a dictionary to a map attribute.
        
        :param hub_dict: The dictionary to be converted to a map attribute.
        :type hub_dict: dict
        
        :return: The map attribute representation of the dictionary.
        :rtype: dict
        
        """
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
        """Converts a model to a dictionary.
        
        :param model: A model object taken from a database.
        :type model: Model
        
        :return: A dictionary representation of the model.
        :rtype: dict
        
        """
        json_str = model.to_json()
        hub_dict = json.loads(json_str)
        return hub_dict

    @staticmethod
    def load_data(pydantic_schema_in, exclude_unset=False):
        """Parse data into a dictionary.

        :param pydantic_schema_in: The data stored in a Pydantic Object to be parsed into a dictionary.
        :type pydantic_schema_in:
        
        :param exclude_unset: Excludes data that was not set during the creation
            of model. Defaults to False.
        :type exclude_unset: bool
        
        :return: 
        :rtype: dict

        """
        return json.loads(pydantic_schema_in.json(exclude_unset=exclude_unset))
