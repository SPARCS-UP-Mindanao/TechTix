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


class PyconEvaluationQuestionType(str, Enum):
    HOW_WOULD_YOU_RATE_PYCON_DAVAO_OVERALL = 'how_would_you_rate_pycon_davao_overall'  # (1-5)
    WhAT_WAS_THE_HIGHLIGHT_OF_THE_EVENT_FOR_YOU = 'what_was_the_highlight_of_the_event_for_you'  # Text
    IS_THERE_ANYTHING_SPECIFIC_YOU_WOULD_LIKE_TO_COMMEND_ABOUT_THE_EVENT = (
        'is_there_anything_specific_you_would_like_to_commend_about_the_event'  # Text
    )
    HOW_SATISFIED_WERE_YOU_WITH_THE_CONTENT_AND_PRESENTATIONS = (
        'how_satisfied_were_you_with_the_content_and_presentations'  # (1-5)
    )
    WHICH_SESSIONS_OR_TOPICS_DID_YOU_FIND_MOST_VALUABLE = 'which_sessions_or_topics_did_you_find_most_valuable'  # Text
    WERE_THERE_ANY_TOPICS_OR_SESSIONS_YOU_FELT_WERE_MISSING = (
        'were_there_any_topics_or_sessions_you_felt_were_missing'  # Text
    )
    HAVE_YOU_ATTENDED_PYTHON_EVENTS_BEFORE = 'have_you_attended_python_events_before_if_so_what_kind_of_community_support_did_you_find_helpful_in_previous_events'  # Text
    HOW_LIKELY_ARE_YOU_TO_RECOMMEND_THIS_EVENT = 'how_likely_are_you_to_recommend_this_event_to_other_python_developers_or_enthusiasts_based_on_the_community_support_provided'  # (1-5)
    # Organization and Logistics
    HOW_WOULD_YOU_RATE_EVENT_ORGANIZATION_AND_LOGISTICS = 'how_would_you_rate_event_organization_and_logistics'  # (1-5)
    WERE_THE_EVENT_SCHEDULE_AND_TIMING_CONVENIENT_FOR_YOU = (
        'were_the_event_schedule_and_timing_convenient_for_you'  # (1-5)
    )
    WERE_THE_VENUE_FACILITIES_ADEQUATE = 'were_the_venue_facilities_adequate'  # (1-5)
    DID_YOU_ENCOUNTER_ANY_PROBLEMS_WITH_THE_ORGANIZATION_AND_LOGISTICS = (
        'did_you_encounter_any_problems_with_the_organization_and_logistics'  # Text
    )
    # Networking and Interaction
    DID_YOU_FIND_OPPORTUNITIES_FOR_NETWORKING_VALUABLE = 'did_you_find_opportunities_for_networking_valuable'  # (1-5)
    HOW_WOULD_YOU_RATE_THE_NETWORKING_OPPORTUNITIES_PROVIDED = (
        'how_would_you_rate_the_networking_opportunities_provided'  # (1-5)
    )
    WHAT_COULD_HAVE_BEEN_IMPROVED_RELATED_TO_THE_NETWORKING = (
        'what_could_have_been_improved_related_to_the_networking_and_interaction_aspects_of_the_event'  # Text
    )
    # Suggestions and Improvements
    SUGGESTIONS_FOR_IMPROVING_FUTURE_PYCON_EVENTS = (
        'what_suggestions_do_you_have_for_improving_future_pycon_events'  # Text
    )
    ADDITIONAL_COMMENTS = 'is_there_anything_else_you_would_like_to_share_about_your_experience_at_the_event'  # Text
    LIKELIHOOD_OF_ATTENDING_FUTURE_PYCON_DAVAO_EVENTS = (
        'how_likely_are_you_to_attend_future_pycon_davao_events'  # (1-5)
    )


class QuestionType(str, Enum):
    MULTIPLE_CHOICE = 'multiple_choice'
    TEXT = 'text'
    BOOLEAN = 'boolean'
    MULTIPLE_CHOICE_WITH_OTHER = 'multiple_choice_with_other'
    MULTIPLE_ANSWERS = 'multiple_answers'
