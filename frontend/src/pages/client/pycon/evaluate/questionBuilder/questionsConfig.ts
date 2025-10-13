import { QuestionConfigItem } from '@/model/pycon/evaluations';

export const EVALUATION_QUESTIONS_1: QuestionConfigItem[] = [
  {
    name: 'how_would_you_rate_pycon_davao_overall',
    questionType: 'slider',
    question: 'How would you rate PyCon Davao overall? (1–5)',
    options: [],
    required: true
  },
  {
    name: 'what_was_the_highlight_of_the_event_for_you',
    questionType: 'text_long',
    question: 'What was the highlight of the event for you?',

    options: [],
    required: true
  },
  {
    name: 'is_there_anything_specific_you_would_like_to_commend_about_the_event',
    questionType: 'text_long',
    question: 'Is there anything specific you would like to commend about the event?',
    options: [],
    required: true
  },
  {
    name: 'how_satisfied_were_you_with_the_content_and_presentations',
    questionType: 'slider',
    question: 'How satisfied were you with the content and presentations? (1–5)',
    options: [],
    required: true
  },

  {
    name: 'which_sessions_or_topics_did_you_find_most_valuable',
    questionType: 'text_long',
    question: 'Which sessions or topics did you find most valuable?',
    options: [],
    required: true
  },
  {
    name: 'were_there_any_topics_or_sessions_you_felt_were_missing',
    questionType: 'text_long',
    question: 'Were there any topics or sessions you felt were missing?',
    options: [],
    required: true
  },
  {
    name: 'have_you_attended_python_events_before_if_so_what_kind_of_community_support_did_you_find_helpful_in_previous_events',
    questionType: 'text_long',
    question: 'Have you attended Python events before? If so, what kind of community support did you find helpful in previous events?',
    options: [],
    required: true
  },

  {
    name: 'how_likely_are_you_to_recommend_this_event_to_other_python_developers_or_enthusiasts_based_on_the_community_support_provided',
    questionType: 'slider',
    question: 'How likely are you to recommend this event to other Python developers or enthusiasts based on the community support provided? (1–5)',
    options: [],
    required: true
  }
];

export const EVALUATION_QUESTIONS_2: QuestionConfigItem[] = [
  {
    name: 'how_would_you_rate_event_organization_and_logistics',
    questionType: 'slider',
    question: 'How would you rate the event organization and logistics? (1–5)',
    options: [],

    required: true
  },
  {
    name: 'were_the_event_schedule_and_timing_convenient_for_you',
    questionType: 'slider',
    question: 'Were the event schedule and timing convenient for you? (1–5)',

    options: [],
    required: true
  },
  {
    name: 'were_the_venue_facilities_adequate',
    questionType: 'slider',
    question: 'Were the venue facilities adequate? (1–5)',
    options: [],
    required: true
  },
  {
    name: 'did_you_encounter_any_problems_with_the_organization_and_logistics',
    questionType: 'text_long',
    question: 'Did you encounter any problems with the organization and logistics?',
    options: [],
    required: true
  },
  {
    name: 'did_you_find_opportunities_for_networking_valuable',
    questionType: 'slider',
    question: 'Did you find opportunities for networking valuable? (1–5)',
    options: [],
    required: true
  },
  {
    name: 'how_would_you_rate_the_networking_opportunities_provided',
    questionType: 'slider',
    question: 'How would you rate the networking opportunities provided? (1–5)',
    options: [],
    required: true
  },
  {
    name: 'what_could_have_been_improved_related_to_the_networking_and_interaction_aspects_of_the_event',
    questionType: 'text_long',
    question: 'What could have been improved related to the networking and interaction aspects of the event?',
    options: [],
    required: true
  },
  {
    name: 'what_suggestions_do_you_have_for_improving_future_pycon_events',
    questionType: 'text_long',
    question: 'What suggestions do you have for improving future PyCon events?',
    options: [],
    required: true
  },
  {
    name: 'is_there_anything_else_you_would_like_to_share_about_your_experience_at_the_event',
    questionType: 'text_long',
    question: 'Is there anything else you would like to share about your experience at the event?',
    options: [],
    required: true
  },
  {
    name: 'how_likely_are_you_to_attend_future_pycon_davao_events',
    questionType: 'slider',
    question: 'How likely are you to attend future PyCon Davao events? (1–5)',
    options: [],
    required: true
  }
];

export const QUESTIONS = new Map([
  ['how_would_you_rate_pycon_davao_overall', 'How would you rate PyCon Davao overall? (1–5)'],
  ['what_was_the_highlight_of_the_event_for_you', 'What was the highlight of the event for you?'],
  ['is_there_anything_specific_you_would_like_to_commend_about_the_event', 'Is there anything specific you would like to commend about the event?'],
  ['how_satisfied_were_you_with_the_content_and_presentations', 'How satisfied were you with the content and presentations? (1–5)'],
  ['which_sessions_or_topics_did_you_find_most_valuable', 'Which sessions or topics did you find most valuable?'],
  ['were_there_any_topics_or_sessions_you_felt_were_missing', 'Were there any topics or sessions you felt were missing?'],
  [
    'have_you_attended_python_events_before_if_so_what_kind_of_community_support_did_you_find_helpful_in_previous_events',
    'Have you attended Python events before? If so, what kind of community support did you find helpful in previous events?'
  ],
  [
    'how_likely_are_you_to_recommend_this_event_to_other_python_developers_or_enthusiasts_based_on_the_community_support_provided',
    'How likely are you to recommend this event to other Python developers or enthusiasts based on the community support provided? (1–5)'
  ],
  ['how_would_you_rate_the_event_organization_and_logistics', 'How would you rate the event organization and logistics? (1–5)'],
  ['were_the_event_schedule_and_timing_convenient_for_you', 'Were the event schedule and timing convenient for you? (1–5)'],
  ['were_the_venue_facilities_adequate', 'Were the venue facilities adequate?'],
  ['did_you_encounter_any_problems_with_the_organization_and_logistics', 'Did you encounter any problems with the organization and logistics?'],
  ['did_you_find_opportunities_for_networking_valuable', 'Did you find opportunities for networking valuable? (1–5)'],
  ['how_would_you_rate_the_networking_opportunities_provided', 'How would you rate the networking opportunities provided? (1–5)'],
  [
    'what_could_have_been_improved_related_to_the_networking_and_interaction_aspects_of_the_event',
    'What could have been improved related to the networking and interaction aspects of the event?'
  ],
  ['what_suggestions_do_you_have_for_improving_future_pycon_events', 'What suggestions do you have for improving future PyCon events?'],
  [
    'is_there_anything_else_you_would_like_to_share_about_your_experience_at_the_event',
    'Is there anything else you would like to share about your experience at the event?'
  ],
  ['how_likely_are_you_to_attend_future_pycon_davao_events', 'How likely are you to attend future PyCon Davao events? (1–5)']
]);
