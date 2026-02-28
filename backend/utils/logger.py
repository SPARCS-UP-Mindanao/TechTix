import logging
import os
from sys import stdout
from backend.utils.pii.pii_masking import mask_sensitive_data

class PIISafeLogger:
    def __init__(self, logger):
        self._logger = logger

    def info(self, message):
        self._logger.info(mask_sensitive_data(str(message)))

    def error(self, message):
        self._logger.error(mask_sensitive_data(str(message)))

    def debug(self, message):
        self._logger.debug(mask_sensitive_data(str(message)))

    def warning(self, message):
        self._logger.warning(mask_sensitive_data(str(message)))

_base_logger = logging.getLogger('sparcs-certificates-service')
handler = logging.StreamHandler(stdout)
if os.getenv('AWS_EXECUTION_ENV'):
    _base_logger.propagate = False
    log_formatter = logging.Formatter('[%(levelname)s] %(message)s')
else:
    log_formatter = logging.Formatter('%(asctime)s %(levelname)-8s %(message)s')
handler.setFormatter(log_formatter)
_base_logger.addHandler(handler)
_base_logger.setLevel(os.getenv('LOG_LEVEL', logging.getLevelName(logging.DEBUG)))

logger = PIISafeLogger(_base_logger)