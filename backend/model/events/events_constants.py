from enum import Enum


class EventStatus(Enum):
    DRAFT = 'draft'
    OPEN = 'open'
    CANCELLED = 'cancelled'
    COMPLETED = 'completed'
