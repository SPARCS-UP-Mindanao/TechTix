import { z } from 'zod';
import { QuestionConfigItem } from '@/model/pycon/evaluations';

export const questionSchemaBuilder = (questions: QuestionConfigItem[]) => {
  const schema = questions.reduce(
    (acc, question) => {
      switch (question.questionType) {
        case 'multiple_answers':
          acc[question.name] = z
            .array(z.string())

            .min(1, { message: 'Please select at least one option' });
          break;

        case 'slider':
          acc[question.name] = z.union([
            z.number().refine((val) => val >= 1 && val <= 5, {
              message: 'Please select a rating from 1 to 5'
            }),
            z.array(z.number()).refine((arr) => arr.length > 0 && arr[0] >= 1 && arr[0] <= 5, {
              message: 'Please select a rating from 1 to 5'
            })
          ]);
          break;

        case 'radio_buttons':
          acc[question.name] = z.union([
            z.string().refine(
              (val) => {
                const num = parseInt(val);
                return !isNaN(num) && num >= 1 && num <= 5;
              },
              {
                message: 'Please select a rating from 1 to 5'
              }
            ),
            z.number().refine((val) => val >= 1 && val <= 5, {
              message: 'Please select a rating from 1 to 5'
            })
          ]);
          break;

        case 'text_short':
          acc[question.name] = z.string().min(1, { message: 'This field is required' }).max(200, { message: 'Response must be 200 characters or less' });
          break;

        case 'text_long':
          acc[question.name] = z.string().min(1, { message: 'This field is required' }).max(1000, { message: 'Response must be 1000 characters or less' });
          break;

        case 'multiple_choice_dropdown':
        case 'multiple_choice':
          acc[question.name] = z.string().min(1, { message: 'Please select an option' });
          break;

        default:
          acc[question.name] = z.any().refine((val) => val !== undefined && val !== null && val !== '', {
            message: 'This field is required'
          });
      }
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>
  );

  return z.object(schema);
};
