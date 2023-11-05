import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const ClaimCertificateFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  })
});

export type ClaimCertificateFormValues = z.infer<typeof ClaimCertificateFormSchema>;

export const useClaimCertificateForm = () => {
  const form = useForm<ClaimCertificateFormValues>({
    mode: 'onChange',
    resolver: zodResolver(ClaimCertificateFormSchema),
    defaultValues: {
      email: ''
    }
  });

  // To add: onSubmit function

  return {
    form
  };
};

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
}

export const QuestionSchemaBuilder = (questions: QuestionConfigItem[]): z.ZodObject<any> => {
  const schema = questions.reduce(
    (acc, question) => {
      if (question.questionType === 'multiple_answers') {
        acc[question.name] = z.array(z.string());
      } else if (question.questionType === 'slider') {
        acc[question.name] = z.array(z.number().min(1).max(5));
      } else if (question.questionType === 'text_short' || question.questionType === 'text_long') {
        acc[question.name] = z.string().min(1); // Minimum length of 1 for text fields
      } else if (question.questionType === 'multiple_choice_dropdown' || question.questionType === 'multiple_choice') {
        acc[question.name] = z.string().refine((value) => value !== '', {
          message: 'This field is required'
        });
      }
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>
  );
  // console.log('Schema', schema);
  return z.object(schema);
};

export const useEvaluationForm = (questions: QuestionConfigItem[]) => {
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(QuestionSchemaBuilder(questions)),
    defaultValues: questions.reduce(
      (acc, question) => {
        acc[question.name] = '';
        return acc;
      },
      {} as Record<string, string>
    )
  });

  // To add onSubmit function

  return {
    form
  };
};
