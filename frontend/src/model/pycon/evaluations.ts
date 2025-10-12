type QuestionType =
  | 'text_short'
  | 'text_long'
  | 'multiple_choice_dropdown'
  | 'multiple_choice'
  | 'multiple_choice_dropdown'
  | 'multiple_answers'
  | 'slider'
  | 'radio_buttons';

export interface QuestionConfigItem {
  questionType: QuestionType;
  name: string;
  question: string;
  options?: string | string[];
  required?: boolean;
  answer?: string | string[];
}

export interface EvaluationResponse {
  answer: string | null;
  answerScale: number | null;
  multipleAnswers: string[] | null;
  booleanAnswer: boolean | null;
  questionType: string | null;
  question: string | null;
  eventId: string;
  createDate: string;
  updateDate: string;
}

export interface Evaluation {
  registration: {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    registrationId: string;
  };
  evaluationList: EvaluationResponse[];
}

export const mapFormValuesToEvaluateCreate = (data: any) => {
  const values = { ...data };
  delete values.email;
  delete values.certificate;
  return convertToEvaluationList(values);
};

export const convertToEvaluationList = (data: any) => {
  // Question type mappings

  const sliderQuestions = [
    'how_would_you_rate_pycon_davao_overall',
    'how_satisfied_were_you_with_the_content_and_presentations',
    'how_likely_are_you_to_recommend_this_event_to_other_python_developers_or_enthusiasts_based_on_the_community_support_provided',
    'how_would_you_rate_event_organization_and_logistics',
    'were_the_event_schedule_and_timing_convenient_for_you',
    'did_you_find_opportunities_for_networking_valuable',
    'how_would_you_rate_the_networking_opportunities_provided',
    'how_likely_are_you_to_attend_future_pycon_davao_events'
  ];

  const textLongQuestions = [
    'what_was_the_highlight_of_the_event_for_you',
    'is_there_anything_specific_you_would_like_to_commend_about_the_event',
    'which_sessions_or_topics_did_you_find_most_valuable',
    'were_there_any_topics_or_sessions_you_felt_were_missing',
    'have_you_attended_python_events_before_if_so_what_kind_of_community_support_did_you_find_helpful_in_previous_events',
    'did_you_encounter_any_problems_with_organization_and_logistics',
    'what_could_have_been_improved_related_to_the_networking_and_interaction_aspects_of_the_event',
    'what_suggestions_do_you_have_for_improving_future_pycon_events',
    'is_there_anything_else_you_would_like_to_share_about_your_experience_at_the_event'
  ];

  const radioButtonQuestions = ['were_the_venue_facilities_adequate'];

  return Object.keys(data).map((key) => {
    const response: Omit<EvaluationResponse, 'eventId' | 'createDate' | 'updateDate'> = {
      answer: null,
      answerScale: null,
      multipleAnswers: null,
      booleanAnswer: null,
      questionType: null,
      question: null
    };

    const value = data[key];

    if (sliderQuestions.includes(key)) {
      response.questionType = 'multiple_choice';
      response.answerScale = Array.isArray(value) ? value[0] : value;
    } else if (radioButtonQuestions.includes(key)) {
      response.questionType = 'boolean';
      if (typeof value === 'string') {
        const numValue = parseInt(value);
        response.booleanAnswer = numValue >= 3;
        response.answerScale = numValue;
      } else if (typeof value === 'number') {
        response.booleanAnswer = value >= 3;
        response.answerScale = value;
      }
    } else if (textLongQuestions.includes(key)) {
      response.questionType = 'text';
      response.answer = value;
    } else {
      // Fallback for any unknown question types
      response.questionType = 'text';
      response.answer = value;
    }

    response.question = key;
    return response;
  });
};
