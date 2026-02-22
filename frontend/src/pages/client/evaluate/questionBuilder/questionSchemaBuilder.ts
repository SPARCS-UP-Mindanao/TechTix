import { z } from 'zod';
import { QuestionConfigItem } from '@/model/evaluations';

export const questionSchemaBuilder = (questions: QuestionConfigItem[]) => {
  const schema = questions.reduce(
    (acc, question) => {
      if (question.questionType === 'multiple_answers') {
        {
          question.required
            ? (acc[question.name] = z.array(z.string()).refine((value) => value.length > 0, {
                message: 'This field is required'
              }))
            : (acc[question.name] = z.array(z.string()).optional());
        }
      } else if (question.questionType === 'slider') {
        {
          question.required ? (acc[question.name] = z.array(z.number().min(1).max(5))) : (acc[question.name] = z.array(z.number().min(1).max(5)).optional());
        }
      } else if (question.questionType === 'text_short' || question.questionType === 'text_long') {
        {
          question.required ? (acc[question.name] = z.string().min(1, { message: 'This field is required' })) : (acc[question.name] = z.string().optional());
        }
      } else if (question.questionType === 'multiple_choice_dropdown' || question.questionType === 'multiple_choice') {
        {
          question.required
            ? (acc[question.name] = z.string().refine((value) => value !== '', {
                message: 'This field is required'
              }))
            : (acc[question.name] = z.string().optional());
        }
      } else if (question.questionType === 'radio_buttons') {
        {
          question.required
            ? (acc[question.name] = z.string().min(1, { message: 'This field is required' }).max(5))
            : (acc[question.name] = z.string().min(1).max(5).optional());
        }
      }
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>
  );
  return z.object(schema);
};
