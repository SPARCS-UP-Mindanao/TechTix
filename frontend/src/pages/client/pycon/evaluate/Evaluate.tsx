import { FC, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import ErrorPage from '@/components/ErrorPage';
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
    <section
      className={cn(
        'flex flex-col grow items-center px-4 h-full w-full text-pycon-custard font-nunito max-w-6xl mx-auto',
        currentStep.id === 'ClaimCertificate' && 'grow-0'
      )}
    >
      <div className="w-full h-full flex flex-col space-y-4 grow">
        {currentStep.id !== 'EventDetails' && currentStep.id !== 'ClaimCertificate' && <h1 className="text-xl">Evaluation</h1>}

        <FormProvider {...form}>
          <div className="flex flex-col md:flex-row w-full h-full grow">
            {showStepper && (
              <div className={cn('my-8', shouldBeVertical && 'h-[700px]')}>
                <Stepper
                  orientation={shouldBeVertical ? 'vertical' : 'horizontal'}
                  steps={STEPS}
                  currentStep={currentStep}
                  stepsToExclude={[STEP_CLAIM_CERTIFICATE]}
                  hideTitle
                />
              </div>
            )}

            <div
              className={cn(
                'space-y-4 grow',
                currentStep.id !== 'EventDetails' && currentStep.id !== 'ClaimCertificate' && shouldBeVertical && 'ms-[20vw] p-8'
              )}
            >
              {currentStep.id === 'EventDetails' && <EventDetails event={eventInfo} />}
              {currentStep.id === 'Evaluation_1' && <QuestionBuilder questions={EVALUATION_QUESTIONS_1} />}
              {currentStep.id === 'Evaluation_2' && <QuestionBuilder questions={EVALUATION_QUESTIONS_2} />}
            </div>
          </div>

          {currentStep.id !== 'EventDetails' && currentStep.id !== 'ClaimCertificate' && <Separator className="my-4 bg-pycon-custard-light" />}

          <EvaluateFooter
            event={eventInfo}
            steps={STEPS}
            currentStep={currentStep}
            fieldsToCheck={fieldsToCheck}
            setCurrentStep={setCurrentStep}
            submitForm={submit}
          />

          {currentStep.id === 'ClaimCertificate' && <ClaimCertificate eventId={eventId!} />}
        </FormProvider>
      </div>
    </section>
  );
};

export default Evaluate;
