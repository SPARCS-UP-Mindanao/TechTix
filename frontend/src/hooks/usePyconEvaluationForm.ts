import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ClaimCertificateResponse, postEvaluation } from '@/api/evaluations';
import { CustomAxiosError } from '@/api/utils/createApi';
import { QuestionConfigItem, mapFormValuesToEvaluateCreate } from '@/model/pycon/evaluations';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { questionSchemaBuilder } from '@/pages/client/pycon/evaluate/questionBuilder/questionSchemaBuilder';
import { EVALUATION_QUESTIONS_1, EVALUATION_QUESTIONS_2 } from '@/pages/client/pycon/evaluate/questionBuilder/questionsConfig';
import { EvaluateStepId } from '@/pages/client/pycon/evaluate/steps/EvaluationSteps';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

export interface DefaultEvaluateFormValues {
  email: string;
  certificate: ClaimCertificateResponse;
  [x: string]: any;
}

export type DefaultEvaluateField = string;
export type DefaultEvaluateFieldMap = Partial<Record<EvaluateStepId, DefaultEvaluateField[]>>;

export const usePyconEvaluationForm = (questions: QuestionConfigItem[], eventId: string) => {
  const EvaluateFormSchema = questionSchemaBuilder(questions).extend({
    email: z.string().optional(),
    certificate: z.custom<ClaimCertificateResponse>().optional()
  });

  type EvaluateFormValues = z.infer<typeof EvaluateFormSchema> & {
    certificate?: ClaimCertificateResponse;
  };

  const api = useApi();
  const { errorToast, successToast } = useNotifyToast();

  const form = useForm<EvaluateFormValues>({
    mode: 'onChange',
    resolver: zodResolver(EvaluateFormSchema),
    defaultValues: {
      email: '',
      ...questions.reduce(
        (acc, question) => {
          if (question.questionType === 'slider') {
            acc[question.name] = [];
          } else if (question.questionType === 'radio_buttons') {
            acc[question.name] = '';
          } else if (question.questionType === 'multiple_answers') {
            acc[question.name] = [];
          } else {
            acc[question.name] = '';
          }
          return acc;
        },
        {} as Record<string, string | number | number[]>
      )
    }
  });

  type EvaluateField = keyof EvaluateFormValues;
  type EvaluateFieldMap = Partial<Record<EvaluateStepId, EvaluateField[]>>;

  const EVALUATE_FIELDS: EvaluateFieldMap = {
    EventDetails: [],
    Evaluation_1: EVALUATION_QUESTIONS_1.map((question) => question.name) as EvaluateField[],
    Evaluation_2: EVALUATION_QUESTIONS_2.map((question) => question.name) as EvaluateField[]
  };

  const submit = form.handleSubmit(async (values) => {
    const { certificate } = values;
    if (!certificate) {
      errorToast({
        title: 'Error',
        description: 'Certificate information is missing. Please try again.'
      });
      return;
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
        description: errorData?.message || errorData?.detail?.[0]?.msg || 'An error occurred while submitting'
      });
    }
  });

  return {
    form,
    submit,
    EVALUATE_FIELDS
  };
};
