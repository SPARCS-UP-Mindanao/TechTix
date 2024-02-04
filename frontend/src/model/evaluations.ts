import { Registration } from './registrations';

const questionTypes = [
  'text_short',
  'text_long',
  'multiple_choice_dropdown',
  'multiple_choice',
  'multiple_choice_dropdown',
  'multiple_answers',
  'slider'
] as const;

export interface QuestionConfigItem {
  questionType: (typeof questionTypes)[number];
  name: string;
  question: string;
  options?: string | string[];
  required?: boolean;
  answer?: string | string[];
}

export interface Evaluation {
  answer: string | null;
  answerScale: number | null;
  multipleAnswers: string[] | null;
  booleanAnswer: boolean | null;
  questionType: string | null;
  question: string | null;
  eventId: string | null;
  registrationId: string | null;
  createDate?: string;
  updateDate?: string;
}

export interface UserEvaluation {
  evaluationList: Evaluation[];
  registration: Registration;
}
