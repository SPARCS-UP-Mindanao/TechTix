from enum import Enum


class EventStatus(str, Enum):
    DRAFT = 'draft'
    OPEN = 'open'
    CANCELLED = 'cancelled'
    CLOSED = 'closed'
    COMPLETED = 'completed'


class EventUploadType(str, Enum):
    BANNER = 'banner'
    LOGO = 'logo'
    CERTIFICATE_TEMPLATE = 'certificateTemplate'


class EventUploadField(str, Enum):
    BANNER = 'bannerLink'
    LOGO = 'logoLink'
    CERTIFICATE_TEMPLATE = 'certificateTemplate'
