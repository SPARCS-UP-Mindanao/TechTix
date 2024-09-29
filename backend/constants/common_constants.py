from enum import Enum


class UserRoles(str, Enum):
    ADMIN = 'admin'
    SUPER_ADMIN = 'super_admin'


class EntryStatus(str, Enum):
    ACTIVE = 'ACTIVE'
    DELETED = 'DELETED'


class CommonConstants:
    # DB Constants
    CLS = 'cls'
    HASH_KEY = 'hashKey'
    RANGE_KEY = 'rangeKey'

    LATEST_VERSION = 'latestVersion'
    ENTRY_STATUS = 'entryStatus'
    CREATE_DATE = 'createDate'
    UPDATE_DATE = 'updateDate'
    CREATED_BY = 'createdBy'
    UPDATED_BY = 'updatedBy'

    ENTRY_ID = 'entryId'
    EVENT_ID = 'eventId'
    ADMIN_ID = 'adminId'
    REGISTRATION_ID = 'registrationId'
    PREREGISTRATION_ID = 'preRegistrationId'

    # Exclude to Comparison Keys
    EXCLUDE_COMPARISON_KEYS = [
        CLS,
        HASH_KEY,
        RANGE_KEY,
        ENTRY_STATUS,
        ENTRY_ID,
        CREATE_DATE,
        UPDATE_DATE,
        CREATED_BY,
        UPDATED_BY,
        LATEST_VERSION,
    ]

    INVALID_URL_PATTERN = r'[:/?#@\[\]!$&\'()*+,;="<>%{}|\\^~`]|[\x00-\x1F\x7F-\xFF]'

    PH_TIMEZONE = 'GMT+08'
    PH_COUNTRY_CODE = 'PH'
    PH_DIAL_CODE = '+63'


class EmailType(str, Enum):
    REGISTRATION_EMAIL = 'registrationEmail'
    PREREGISTRATION_EMAIL = 'preRegistrationEmail'
    CONFIRMATION_EMAIL = 'confirmationEmail'
    EVALUATION_EMAIL = 'evaluationEmail'
    EVENT_CREATION_EMAIL = 'eventCreationEmail'
    ADMIN_INVITATION_EMAIL = 'adminInvitationEmail'


class SpecialEmails(str, Enum):
    DURIAN_PY = 'durianpy.davao@gmail.com'
    AWSUG_DAVAO = 'hello@awsugdavao.ph'


class SpecialSenders(str, Enum):
    DURIAN_PY = 'DurianPy - Davao Python User Group'
    AWSUG_DAVAO = 'AWS User Group Davao'
