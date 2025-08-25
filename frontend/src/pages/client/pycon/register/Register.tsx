import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import ErrorPage from '@/components/ErrorPage';
import { FormDescription, FormError, FormItem, FormItemContainer, FormLabel } from '@/components/Form';
import Input from '@/components/Input';
import Separator from '@/components/Separator';
import Stepper from '@/components/Stepper';
import { Event } from '@/model/events';
import { REGISTER_FIELDS, useRegisterForm } from '../hooks/useRegisterForm';
import EventDetails from './EventDetails';
import EventHeader from './EventHeader';
import FAQs from './FAQs';
import RegisterFormLoading from './RegisterFormSkeleton';
import RegisterFooter from './footer/RegisterFooter';
import BasicInfoStep from './steps/BasicInfoStep';
import MiscellaneousStep from './steps/MiscellaneousStep';
import PaymentAndVerificationStep from './steps/PaymentAndVerificationStep';
import { RegisterStep, RegisterStepsWithPayment, STEP_EVENT_DETAILS, STEP_SUCCESS } from './steps/RegistrationSteps';
import SuccessStep from './steps/SuccessStep';
import SummaryStep from './steps/SummaryStep';
import TicketSelectionStep from './steps/TicketSelectionStep';
import { useRegisterPage } from './useRegisterPage';
import { useSuccess } from './useSuccess';

const Register: FC = () => {
  const { eventId } = useParams();

  const navigateOnSuccess = () => setCurrentStep(STEP_SUCCESS);

  const [currentStep, setCurrentStep] = useState<RegisterStep>(STEP_EVENT_DETAILS);
  // const [currentStep, setCurrentStep] = useState<RegisterStep>(CURRENT_STEP);
  const [eventInfo, setEventInfo] = useState<Event | null>(null);
  const [isFeesLoading, setIsFeesLoading] = useState(false);

  const { form, onSubmit } = useRegisterForm(eventId!, navigateOnSuccess);
  const { response, isPending } = useRegisterPage(eventId!, setCurrentStep);
  const { isSuccessLoading, isRegisterSuccessful, retryRegister } = useSuccess(currentStep, form.getValues, onSubmit);

  const updateEventPrice = (newPrice: number) => {
    if (eventInfo) {
      setEventInfo({ ...eventInfo, price: newPrice });
    }
  };

  if (isPending || isSuccessLoading) {
    return <RegisterFormLoading />;
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
    <section className="flex flex-col items-center px-4">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
        <EventHeader event={eventInfo} />

        <FormProvider {...form}>
          <main className="w-full">
            {currentStep.id !== 'EventDetails' && <h1 className="text-xl text-center">{currentStep.title}</h1>}

            {showStepper && <Stepper steps={STEPS} currentStep={currentStep} stepsToExclude={[STEP_SUCCESS]} />}

            <div className="space-y-4">
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
            </div>

            {currentStep.id === 'Summary' && <SummaryStep event={eventInfo} />}
            {currentStep.id === 'Success' && <SuccessStep event={eventInfo} isRegisterSuccessful={isRegisterSuccessful} />}
            {currentStep.id !== 'EventDetails' && currentStep.id !== 'Success' && <Separator className="my-4" />}

            {currentStep.id === 'EventDetails' && eventInfo.isApprovalFlow && eventInfo.status === 'open' && (
              <FormItem name="email">
                {({ field }) => (
                  <FormItemContainer className="px-0 my-6">
                    <FormLabel>Email</FormLabel>
                    <Input type="email" {...field} />
                    <FormDescription>Enter the email address you used for pre-registering</FormDescription>
                    <FormError />
                  </FormItemContainer>
                )}
              </FormItem>
            )}

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
          </main>
        </FormProvider>
      </div>
    </section>
  );
};

export default Register;
