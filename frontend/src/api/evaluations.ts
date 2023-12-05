import { createApi } from './utils/createApi';

export interface EvaluationResponseProps {
  answer: string | null;
  answerScale: number | null;
  multipleAnswers: string[] | null;
  booleanAnswer: boolean | null;
  questionType: string | null;
  question: string | null;
}

export interface ClaimCertificateResponse {
  isFirstClaim: boolean;
  certificateTemplate: string;
  certificatePDFTemplate: string;
  registrationId: string;
  certificateTemplateKey: string;
  certificatePDFTemplateKey: string;
}

export const claimCertificate = (email: string, eventId: string) =>
  createApi<ClaimCertificateResponse>({
    method: 'put',
    url: `/certificates/${eventId}/claim`,
    body: {
      email
    }
  });

export const convertToEvaluationList = (data: any) => {
  const questions = [
    'overall_experience',
    'how_did_you_hear_about_the_event',
    'what_do_you_like_most_about_the_event',
    'what_could_be_improved',
    'event_timing_convenient',
    'quality_of_speakers',
    'how_likely_recommend_events_to_others',
    'suggestions_event_topics',
    'other_comments',
    'notified_of_future_events'
  ] as const;

  return Object.keys(data).map((key) => {
    const response: EvaluationResponseProps = {
      answer: null,
      answerScale: null,
      multipleAnswers: null,
      booleanAnswer: null,
      questionType: null,
      question: null
    };

    switch (key) {
      case 'overall_experience':
      case 'event_timing_convenient':
      case 'quality_of_speakers':
      case 'how_likely_recommend_events_to_others':
        response.questionType = 'multiple_choice';
        response.question = questions.find((q) => q === key) || '';
        response.answerScale = data[key][0];
        break;
      case 'how_did_you_hear_about_the_event':
      case 'what_do_you_like_most_about_the_event':
      case 'what_could_be_improved':
      case 'suggestions_event_topics':
      case 'other_comments':
        response.questionType = 'text';
        response.question = questions.find((q) => q === key) || '';
        response.answer = data[key];
        break;
      case 'notified_of_future_events':
        response.questionType = 'boolean';
        response.question = questions.find((q) => q === key) || '';
        response.booleanAnswer = data[key] === 'Yes';
        break;
    }

    return response;
  });
};

export const postEvaluation = (eventId: string, registrationId: string, data: unknown) => {
  const params = {
    evaluationList: convertToEvaluationList(data),
    eventId,
    registrationId
  };
  return createApi({
    method: 'post',
    url: `/evaluations`,
    body: params
  });
};

export const getEventEvaluations = (eventId: string) =>
  createApi({
    method: 'get',
    url: '/evaluations',
    authorize: true,
    queryParams: { eventId }
  });
