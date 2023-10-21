from enum import Enum

class EvaluationStatus(Enum):
    DRAFT = 'draft'
    OPEN = 'open'
    CANCELLED = 'cancelled'
    COMPLETED = 'completed'