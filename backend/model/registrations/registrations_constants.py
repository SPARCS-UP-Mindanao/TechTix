from enum import Enum

class RegistrationStatus(Enum):
    DRAFT = 'draft'
    OPEN = 'open'
    CANCELLED = 'cancelled'
    COMPLETED = 'completed'