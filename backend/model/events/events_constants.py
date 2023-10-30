from enum import Enum


class EventStatus(Enum):
    DRAFT = 'draft'
    OPEN = 'open'
    CANCELLED = 'cancelled'
    CLOSED = 'closed'
    COMPLETED = 'completed'

class EventUploadTypes(Enum):
    BANNER = 'banner'
    LOGO = 'logo'
    CERTIFICATE_TEMPLATE = 'certificateTemplate'

class EventUploadFields(Enum):
    BANNER = 'bannerLink'
    LOGO = 'logoLink'
    CERTIFICATE_TEMPLATE = 'certificateTemplate'

