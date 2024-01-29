import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { postEvaluation } from '@/api/evaluations';
import { QuestionConfigItem } from '@/model/evaluations';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApi } from './useApi';

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

export const QuestionSchemaBuilder = (questions: QuestionConfigItem[]): z.ZodObject<any> => {
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
      }
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>
  );
  return z.object(schema);
};

export const useEvaluationForm = (questions: QuestionConfigItem[], eventId: string, registrationId?: string) => {
  const api = useApi();
  const { errorToast } = useNotifyToast();
  const [postEvalSuccess, setPostEvalSuccess] = useState(false);
  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(QuestionSchemaBuilder(questions)),
    defaultValues: questions.reduce(
      (acc, question) => {
        if (question.questionType === 'slider') {
          acc[question.name] = [] as number[];
          return acc;
        }
        acc[question.name] = '';
        return acc;
      },
      {} as Record<string, string | number[]>
    )
  });

  const submitEvaluation = form.handleSubmit(async (values) => {
    const response = await api.execute(postEvaluation(eventId, registrationId!, values));
    try {
      if (response.status === 200) {
        setPostEvalSuccess(true);
      }
    } catch (error) {
      if (response.status === 400) {
        errorToast({
          title: 'Error in submitting evaluation',
          description: 'Please try again.'
        });
      }
    }
  });

  return {
    form,
    submitEvaluation,
    postEvalSuccess
  };
};
