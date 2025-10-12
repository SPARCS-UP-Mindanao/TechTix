import { FC, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import ErrorPage from '@/components/ErrorPage';
import { FormDescription, FormError, FormItem, FormItemContainer, FormLabel } from '@/components/Form';
import Input from '@/components/Input';
import Separator from '@/components/Separator';
import { cn } from '@/utils/classes';
import { useActiveBreakpoints } from '@/hooks/useActiveBreakpoints';
import { DefaultEvaluateField, usePyconEvaluationForm } from '@/hooks/usePyconEvaluationForm';
import EventDetails from '../register/EventDetails';
import Stepper from '../register/steps/Stepper';
import EvaluateFormSkeleton from './EvaluateFormSkeleton';
import EvaluateFooter from './footer/EvaluateFooter';
import QuestionBuilder from './questionBuilder/QuestionBuilder';
import { EVALUATION_QUESTIONS_1, EVALUATION_QUESTIONS_2 } from './questionBuilder/questionsConfig';
import ClaimCertificate from './steps/ClaimCertificate';
import { EvaluateStep, EvaluateSteps, STEP_CLAIM_CERTIFICATE, STEP_EVENT_DETAILS } from './steps/EvaluationSteps';
import { useEvaluatePage } from './useEvaluatePage';

interface Props {
  eventId: string;
}

const Evaluate: FC<Props> = ({ eventId }) => {
  const [currentStep, setCurrentStep] = useState<EvaluateStep>(STEP_EVENT_DETAILS);
  const [shouldBeVertical] = useActiveBreakpoints('md');

  const { response, isPending } = useEvaluatePage(eventId);
  const { form, EVALUATE_FIELDS, submit } = usePyconEvaluationForm([...EVALUATION_QUESTIONS_1, ...EVALUATION_QUESTIONS_2], eventId);

  if (isPending) return <EvaluateFormSkeleton />;
  if (!response || (response && !response.data && response.errorData)) return <ErrorPage error={response} />;
  if (response.data.status !== 'completed') return <ErrorPage />;

  const eventInfo = response.data;
  const fieldsToCheck: DefaultEvaluateField[] = EVALUATE_FIELDS[currentStep.id] || [];
  const STEPS = EvaluateSteps;
  const showStepper = currentStep.id !== 'EventDetails' && currentStep.id !== 'ClaimCertificate';

  return (
    <section className="flex flex-col items-center px-4">
      <div className="w-full max-w-6xl space-y-6 flex flex-col items-center">
        <FormProvider {...form}>
          <div className="flex flex-col md:flex-row items-start gap-5 lg:gap-15 w-full lg:mt-10">
            {showStepper && (
              <aside className="w-full md:w-1/4 md:min-w-[240px] lg:h-[50vh]">
                {showStepper && (
                  <div className={cn('my-8', shouldBeVertical && 'h-[700px]')}>
                    <Stepper
                      orientation={shouldBeVertical ? 'vertical' : 'horizontal'}
                      steps={STEPS}
                      currentStep={currentStep}
                      stepsToExclude={[STEP_CLAIM_CERTIFICATE]}
                    />
                  </div>
                )}
              </aside>
            )}

            <main className="flex-1">
              {currentStep.id !== 'EventDetails' && currentStep.title && <h1 className="text-xl text-center md:text-left mb-4">{currentStep.title}</h1>}
              <div className="space-y-4">
                {currentStep.id === 'EventDetails' && <EventDetails event={eventInfo} />}
                {currentStep.id === 'Evaluation_1' && <QuestionBuilder questions={EVALUATION_QUESTIONS_1} />}
                {currentStep.id === 'Evaluation_2' && <QuestionBuilder questions={EVALUATION_QUESTIONS_2} />}
              </div>

              {(currentStep.id === 'Evaluation_1' || currentStep.id === 'Evaluation_2') && <Separator className="my-4" />}

              <EvaluateFooter
                event={eventInfo}
                steps={STEPS}
                currentStep={currentStep}
                fieldsToCheck={fieldsToCheck}
                setCurrentStep={setCurrentStep}
                submitForm={submit}
              />
            </main>
          </div>

          {currentStep.id === 'ClaimCertificate' && <ClaimCertificate eventId={eventId!} />}
        </FormProvider>
      </div>
    </section>
  );
};

export default Evaluate;
