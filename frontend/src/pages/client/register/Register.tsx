import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import ErrorPage from '@/components/ErrorPage';
import ImageViewer from '@/components/ImageViewer';
import Separator from '@/components/Separator';
import { REGISTER_STEPS_FIELD, RegisterField, useRegisterForm } from '@/hooks/useRegisterForm';
import EventDetails from './EventDetails';
import RegisterFooter from './RegisterFooter';
import RegisterFormLoading from './RegisterFormSkeleton';
import RegisterFormSubmittingSkeleton from './RegisterFormSubmittingSkeleton';
import Stepper from './Stepper';
import { RegisterStep, RegisterSteps, RegisterStepsWithPayment, STEP_EVENT_DETAILS, STEP_SUCCESS } from './Steps';
import PaymentStep from './steps/PaymentStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import SuccessStep from './steps/SuccessStep';
import SummaryStep from './steps/SummaryStep';
import UserBioStep from './steps/UserBioStep';
import { useRegisterPage } from './useRegisterPage';
import { useSuccess } from './useSuccess';

const Register = () => {
  const { eventId } = useParams();

  const navigateOnSuccess = () => setCurrentStep(STEP_SUCCESS);
  const { form, submit } = useRegisterForm(eventId!, navigateOnSuccess);
  const submitForm = async () => await submit();

  const [currentStep, setCurrentStep] = useState<RegisterStep>(STEP_EVENT_DETAILS);

  const { response, isFetching } = useRegisterPage(eventId!, setCurrentStep);

  const { isSuccessLoading } = useSuccess(currentStep, submitForm);

  if (isFetching) {
    return <RegisterFormLoading />;
  }

  if (!response || (response && !response.data && response.errorData)) {
    return <ErrorPage error={response} />;
  }

  const eventInfo = response.data;

  if (eventInfo.status === 'draft') {
    return <ErrorPage />;
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

  if (eventInfo.paidEvent && eventInfo.status === 'completed') {
    return <ErrorPage errorTitle="Registration is Closed" message={`Thank you for your interest but ${eventInfo.name} is no longer open for registration.`} />;
  }

  if (isSuccessLoading) {
    return <RegisterFormSubmittingSkeleton />;
  }

  const fieldsToCheck: RegisterField[] = REGISTER_STEPS_FIELD[currentStep.id] || [];
  const STEPS = eventInfo.paidEvent ? RegisterStepsWithPayment : RegisterSteps;
  const showStepper = currentStep.id !== 'EventDetails' && currentStep.id !== 'Success';

  return (
    <section className="flex flex-col items-center px-4">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
        <ImageViewer objectKey={eventInfo.logoLink} className="w-12 h-12 rounded-full overflow-hidden" />
        <div className="flex w-full justify-center relative overflow-hidden">
          <ImageViewer objectKey={eventInfo.bannerLink} className="w-full max-w-md object-cover z-10" />
          <div className="blur-2xl absolute w-full h-full inset-0 bg-center" style={{ backgroundImage: `url(${eventInfo.bannerUrl})` }}></div>
        </div>

        <FormProvider {...form}>
          <main className="w-full">
            {currentStep.id !== 'EventDetails' && <h1 className="text-xl text-center">{currentStep.title}</h1>}
            {showStepper && <Stepper steps={STEPS} currentStep={currentStep} />}

            <div className="space-y-4">
              {currentStep.id === 'EventDetails' && <EventDetails event={eventInfo} />}
              {currentStep.id === 'UserBio' && <UserBioStep />}
              {currentStep.id === 'PersonalInfo' && <PersonalInfoStep />}
              {currentStep.id === 'Payment' && <PaymentStep eventPrice={eventInfo.price} />}
            </div>

            {currentStep.id === 'Summary' && <SummaryStep event={eventInfo} />}
            {currentStep.id === 'Success' && <SuccessStep eventName={eventInfo.name} />}
            {currentStep.id !== 'EventDetails' && currentStep.id !== 'Success' && <Separator className="my-4" />}

            <RegisterFooter event={eventInfo} steps={STEPS} currentStep={currentStep} fieldsToCheck={fieldsToCheck} setCurrentStep={setCurrentStep} />
          </main>
        </FormProvider>
      </div>
    </section>
  );
};

export default Register;
