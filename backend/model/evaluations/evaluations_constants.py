from enum import Enum


class EvaluationQuestionType(str, Enum):
    OVERALL_EXP = 'overall_experience'
    HOW_DID_YOU_HEAR_ABOUT_THE_EVENT = 'how_did_you_hear_about_the_event'
    WHAT_DO_YOU_LIKE_MOST_ABOUT_THE_EVENT = 'what_do_you_like_most_about_the_event'
    WHAT_COULD_BE_IMPOROVED = 'what_could_be_improved'
    EVENT_TIMING_CONVENIENT = 'event_timing_convenient'
    QUALITY_OF_SPEAKERS = 'quality_of_speakers'
    HOW_LIKELY_RECOMMEND_EVENTS_TO_OTHERS = 'how_likely_recommend_events_to_others'
    SUGGESTIONS_EVENT_TOPICS = 'suggestions_event_topics'
    OTHER_COMMENTS = 'other_comments'
    NOTIFIED_OF_FUTURE_EVENTS = 'notified_of_future_events'


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = 'multiple_choice'
    TEXT = 'text'
    BOOLEAN = 'boolean'
    MULTIPLE_CHOICE_WITH_OTHER = 'multiple_choice_with_other'
    MULTIPLE_ANSWERS = 'multiple_answers'
