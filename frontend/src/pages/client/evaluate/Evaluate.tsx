import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import ErrorPage from '@/components/ErrorPage';
import { FormDescription, FormError, FormItem, FormItemContainer, FormLabel } from '@/components/Form';
import Input from '@/components/Input';
import Separator from '@/components/Separator';
import Stepper from '@/components/Stepper';
import { DefaultEvaluateField, useEvaluationForm } from '@/hooks/useEvaluationForm';
import EventDetails from '../register/EventDetails';
import EventHeader from '../register/EventHeader';
import EvaluateFormSkeleton from './EvaluateFormSkeleton';
import EvaluateFooter from './footer/EvaluateFooter';
import QuestionBuilder from './questionBuilder/QuestionBuilder';
import { EVALUTATION_QUESTIONS_1, EVALUTATION_QUESTIONS_2 } from './questionBuilder/questionsConfig';
import ClaimCertificate from './steps/ClaimCertificate';
import { EvaluateStep, EvaluateSteps, STEP_CLAIM_CERTIFICATE, STEP_EVENT_DETAILS } from './steps/EvaluationSteps';
import { useEvaluatePage } from './useEvaluatePage';

const Evaluate = () => {
  const { eventId } = useParams();
  const [currentStep, setCurrentStep] = useState<EvaluateStep>(STEP_EVENT_DETAILS);
  const { response, isFetching } = useEvaluatePage(eventId!);

  const { form, EVALUATE_FIELDS, submit } = useEvaluationForm([...EVALUTATION_QUESTIONS_1, ...EVALUTATION_QUESTIONS_2], eventId!);

  if (isFetching) {
    return <EvaluateFormSkeleton />;
  }

  if (!response || (response && !response.data && response.errorData)) {
    return <ErrorPage error={response} />;
  }

  if (response.data.status !== 'completed') {
    return <ErrorPage />;
  }

  const eventInfo = response.data;
  const fieldsToCheck: DefaultEvaluateField[] = EVALUATE_FIELDS[currentStep.id] || [];
  const STEPS = EvaluateSteps;
  const showStepper = currentStep.id !== 'EventDetails' && currentStep.id !== 'ClaimCertificate';

  return (
    <section className="flex flex-col items-center px-4">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
        <EventHeader event={eventInfo} showBanner={currentStep.id !== 'ClaimCertificate'} />

        <FormProvider {...form}>
          <main className="w-full">
            {currentStep.id !== 'EventDetails' && currentStep.title && <h1 className="text-xl text-center">{currentStep.title}</h1>}

            {showStepper && <Stepper steps={STEPS} currentStep={currentStep} stepsToExclude={[STEP_CLAIM_CERTIFICATE]} />}

            <div className="space-y-4">
              {currentStep.id === 'EventDetails' && <EventDetails event={eventInfo} />}
              {currentStep.id === 'Evaluation_1' && <QuestionBuilder questions={EVALUTATION_QUESTIONS_1} />}
              {currentStep.id === 'Evaluation_2' && <QuestionBuilder questions={EVALUTATION_QUESTIONS_2} />}
            </div>

            {currentStep.id === 'EventDetails' && (
              <FormItem name="email">
                {({ field }) => (
                  <FormItemContainer className="px-0 my-6">
                    <FormLabel>Email</FormLabel>
                    <Input type="email" {...field} />
                    <FormDescription>Enter the email address you used for registering for the event</FormDescription>
                    <FormError />
                  </FormItemContainer>
                )}
              </FormItem>
            )}

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

          {currentStep.id === 'ClaimCertificate' && <ClaimCertificate eventId={eventId!} />}
        </FormProvider>
      </div>
    </section>
  );
};

export default Evaluate;
