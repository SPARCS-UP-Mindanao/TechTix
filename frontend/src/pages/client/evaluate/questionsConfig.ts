import { QuestionConfigItem } from '@/model/evaluations';

export const question1: QuestionConfigItem[] = [
  {
    name: 'overall_experience',
    questionType: 'slider',
    question: 'Please rate your overall experience of the event (5 being the highest).',
    options: [],
    required: true
  },
  {
    name: 'how_did_you_hear_about_the_event',
    questionType: 'text_short',
    question: 'How did you hear about the event?',
    options: [],
    required: true
  },
  {
    name: 'what_do_you_like_most_about_the_event',
    questionType: 'text_long',
    question: 'What do you like most about the event?',
    options: [],
    required: true
  },
  {
    name: 'what_could_be_improved',
    questionType: 'text_long',
    question: 'What do you think could be improved for the event?',
    options: [],
    required: true
  },
  {
    name: 'event_timing_convenient',
    questionType: 'slider',
    question: 'Please rate your satisfaction with the duration of the event (5 being the highest).',
    options: [],
    required: true
  }
];

export const question2: QuestionConfigItem[] = [
  {
    name: 'quality_of_speakers',
    questionType: 'slider',
    question: 'Please rate the quality of the speakers (5 being the highest).',
    options: [],
    required: true
  },
  {
    name: 'how_likely_recommend_events_to_others',
    questionType: 'slider',
    question: 'Please rate how likely you are to recommend the event to others (5 being most likely)',
    options: [],
    required: true
  },
  {
    name: 'suggestions_event_topics',
    questionType: 'text_long',
    question: 'Suggest topics you would like to be discussed in future events.',
    options: [],
    required: true
  },
  {
    name: 'other_comments',
    questionType: 'text_long',
    question: 'If you have further comments, please write them below.',
    options: [],
    required: false
  },
  {
    name: 'notified_of_future_events',
    questionType: 'multiple_choice',
    question: 'Do you want to be notified of future events?',
    options: ['Yes', 'No'],
    required: true
  }
];

export const questionToDisplayMap = new Map([
  ['overall_experience', 'Please rate your overall experience of the event (5 being the highest).'],
  ['how_did_you_hear_about_the_event', 'How did you hear about the event?'],
  ['what_do_you_like_most_about_the_event', 'What do you like most about the event?'],
  ['what_could_be_improved', 'What do you think could be improved for the event?'],
  ['event_timing_convenient', 'Please rate your satisfaction with the duration of the event (5 being the highest).'],
  ['quality_of_speakers', 'Please rate the quality of the speakers (5 being the highest).'],
  ['how_likely_recommend_events_to_others', 'Please rate how likely you are to recommend the event to others (5 being most likely)'],
  ['suggestions_event_topics', 'Suggest topics you would like to be discussed in future events.'],
  ['other_comments', 'If you have further comments, please write them below.'],
  ['notified_of_future_events', 'Do you want to be notified of future events?']
]);
