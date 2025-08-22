import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ClaimCertificateResponse, postEvaluation } from '@/api/evaluations';
import { CustomAxiosError } from '@/api/utils/createApi';
import { QuestionConfigItem, mapFormValuesToEvaluateCreate } from '@/model/evaluations';
import { isEmpty } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { questionSchemaBuilder } from '@/pages/client/evaluate/questionBuilder/questionSchemaBuilder';
import { EVALUTATION_QUESTIONS_1, EVALUTATION_QUESTIONS_2 } from '@/pages/client/evaluate/questionBuilder/questionsConfig';
import { EvaluateStepId } from '@/pages/client/evaluate/steps/EvaluationSteps';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

export interface DefaultEvaluateFormValues {
  email: string;
  certificate: ClaimCertificateResponse;
  [x: string]: any;
}

export type DefaultEvaluateField = string;
export type DefaultEvaluateFieldMap = Partial<Record<EvaluateStepId, DefaultEvaluateField[]>>;

export const useEvaluationForm = (questions: QuestionConfigItem[], eventId: string) => {
  const EvaluateFormSchema = questionSchemaBuilder(questions).extend({
    email: z.email({
      message: 'Please enter a valid email address'
    }),
    certificate: z.custom<ClaimCertificateResponse>().refine((value) => !isEmpty(value), {
      message: 'Please try refreshing the page'
    })
  });

  type EvaluateFormValues = z.infer<typeof EvaluateFormSchema> & {
    certificate?: ClaimCertificateResponse;
  };

  const api = useApi();
  const { errorToast, successToast } = useNotifyToast();
  const form = useForm<EvaluateFormValues>({
    mode: 'onChange',
    resolver: zodResolver(EvaluateFormSchema),
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

  type EvaluateField = keyof EvaluateFormValues;
  type EvaluateFieldMap = Partial<Record<EvaluateStepId, EvaluateField[]>>;

  const EVALUATE_FIELDS: EvaluateFieldMap = {
    EventDetails: ['email'],
    Evaluation_1: EVALUTATION_QUESTIONS_1.map((question) => question.name),
    Evaluation_2: EVALUTATION_QUESTIONS_2.map((question) => question.name)
  };

  const submit = form.handleSubmit(async (values) => {
    const { certificate } = values;

    if (!certificate) {
      throw Error('Certificate information is missing!');
    }

    const { registrationId } = certificate;

    try {
      const response = await api.execute(postEvaluation(eventId, registrationId, mapFormValuesToEvaluateCreate(values)));
      if (response.status === 200) {
        successToast({
          title: 'Evaluation submitted successfully!',
          description: 'Thank you for submitting your evaluation. You may now access your certificate.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in submitting evaluation',
        description: errorData.message || errorData.detail[0].msg
      });
    }
  });

  return {
    form,
    submit,
    EVALUATE_FIELDS
  };
};
