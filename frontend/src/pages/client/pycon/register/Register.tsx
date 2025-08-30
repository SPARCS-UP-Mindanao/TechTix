import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import ErrorPage from '@/components/ErrorPage';
import Separator from '@/components/Separator';
import Skeleton from '@/components/Skeleton';
import { Event } from '@/model/events';
import { cn } from '@/utils/classes';
import { useActiveBreakpoints } from '@/hooks/useActiveBreakpoints';
import { REGISTER_FIELDS, useRegisterForm } from '../hooks/useRegisterForm';
import EventDetails from './EventDetails';
import FAQs from './FAQs';
import RegisterFooter from './footer/RegisterFooter';
import BasicInfoStep from './steps/BasicInfoStep';
import MiscellaneousStep from './steps/MiscellaneousStep';
import PaymentAndVerificationStep from './steps/PaymentAndVerificationStep';
import { RegisterStep, RegisterStepsWithPayment, STEP_EVENT_DETAILS, STEP_SUCCESS } from './steps/RegistrationSteps';
import Stepper from './steps/Stepper';
import SuccessStep from './steps/SuccessStep';
import SummaryStep from './steps/SummaryStep';
import TicketSelectionStep from './steps/TicketSelectionStep';
import { useRegisterPage } from './useRegisterPage';
import { useSuccess } from './useSuccess';
import PyconBackground from '@/routes/layouts/PyconBackground';

const Register: FC = () => {
  const { eventId } = useParams();

  const navigateOnSuccess = () => setCurrentStep(STEP_SUCCESS);

  const [currentStep, setCurrentStep] = useState<RegisterStep>(STEP_EVENT_DETAILS);
  const [eventInfo, setEventInfo] = useState<Event | null>(null);
  const [isFeesLoading, setIsFeesLoading] = useState(false);

  const { response, isPending } = useRegisterPage(eventId!, setCurrentStep);
  const { form, onSubmit } = useRegisterForm(eventId!, navigateOnSuccess);
  const { isSuccessLoading, isRegisterSuccessful, retryRegister } = useSuccess(currentStep, form.getValues, onSubmit);

  const [shouldBeVertical] = useActiveBreakpoints('md');

  const updateEventPrice = (newPrice: number) => {
    if (eventInfo) {
      setEventInfo({ ...eventInfo, price: newPrice });
    }
  };

  if (isPending || isSuccessLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!response || (response && !response.data && response.errorData)) {
    return <ErrorPage error={response} />;
  }

  if (!eventInfo) {
    setEventInfo(response.data);
    return null;
  }

  if (eventInfo.status === 'draft') {
    return <ErrorPage />;
  }

  if (eventInfo.maximumSlots && eventInfo.maximumSlots === eventInfo.registrationCount) {
    return (
      <ErrorPage
        errorTitle="Slots are full"
        message={`Thank you for your interest but ${eventInfo.name} has already reached its maximum slots for participants.`}
      />
    );
  }

  if (eventInfo.status === 'closed') {
    return <ErrorPage errorTitle="Sold Out" message={`Thank you for your interest but ${eventInfo.name} is no longer open for registration.`} />;
  }

  if (eventInfo.status === 'cancelled') {
    const errorTitle = `${eventInfo.name} is Cancelled`;
    return (
      <ErrorPage
        errorTitle={errorTitle}
        message={`We've had to cancel, but please follow us on social media for future news. Sorry for the inconvenience, and thank you for your support!`}
      />
    );
  }

  if (eventInfo.status === 'completed') {
    return <ErrorPage errorTitle="Registration is Closed" message={`Thank you for your interest but ${eventInfo.name} is no longer open for registration.`} />;
  }

  const fieldsToCheck = REGISTER_FIELDS[currentStep.id];
  const STEPS = RegisterStepsWithPayment;
  const showStepper = currentStep.id !== 'EventDetails' && currentStep.id !== 'Success';
  const showFAQs = currentStep.id === 'EventDetails';

  return (
    <section className="flex flex-col grow items-center px-4 h-full w-full text-pycon-custard font-inter max-w-6xl mx-auto">
      <div className="w-full h-full flex flex-col space-y-4 grow">
        <FormProvider {...form}>
          {currentStep.id !== 'EventDetails' && currentStep.id !== 'Success' && <h1 className="text-xl">{currentStep.title}</h1>}

          <div className="flex flex-col md:flex-row w-full h-full grow">
            {showStepper && (
              <div className={cn('my-8', shouldBeVertical && 'h-[700px]')}>
                <Stepper orientation={shouldBeVertical ? 'vertical' : 'horizontal'} steps={STEPS} currentStep={currentStep} stepsToExclude={[STEP_SUCCESS]} />
              </div>
            )}

            <div className={cn('space-y-4 grow', currentStep.id !== 'EventDetails' && currentStep.id !== 'Success' && shouldBeVertical && 'ms-[20vw] p-8')}>
              {currentStep.id === 'EventDetails' && <EventDetails event={eventInfo} />}
              {currentStep.id === 'BasicInfo' && <BasicInfoStep />}
              {currentStep.id === 'TicketSelection' && <TicketSelectionStep event={eventInfo} updateEventPrice={updateEventPrice} />}
              {currentStep.id === 'Miscellaneous' && <MiscellaneousStep event={eventInfo} updateEventPrice={updateEventPrice} />}
              {currentStep.id === 'Payment&Verification' && (
                <PaymentAndVerificationStep
                  eventId={eventId!}
                  eventPrice={eventInfo.price}
                  platformFee={eventInfo.platformFee}
                  isFeesLoading={isFeesLoading}
                  setIsFeesLoading={setIsFeesLoading}
                />
              )}

              {currentStep.id === 'Summary' && <SummaryStep event={eventInfo} />}
              {currentStep.id === 'Success' && <SuccessStep event={eventInfo} isRegisterSuccessful={isRegisterSuccessful} />}
            </div>
          </div>

          {currentStep.id !== 'EventDetails' && currentStep.id !== 'Success' && <Separator className="my-4 bg-pycon-custard-light" />}

          <RegisterFooter
            event={eventInfo}
            steps={STEPS}
            currentStep={currentStep}
            fieldsToCheck={fieldsToCheck}
            isRegisterSuccessful={isRegisterSuccessful}
            retryRegister={retryRegister}
            setCurrentStep={setCurrentStep}
            isFeesLoading={isFeesLoading}
          />

          {showFAQs && <FAQs />}
        </FormProvider>
      </div>

      <PyconBackground />
    </section>
  );
};

export default Register;
