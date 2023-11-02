import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import sparcsApplicationimage from '@/assets/applicationSpracs.svg';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { getEvent } from '@/api/events';
import { isEmpty } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { RegisterFormValues, useRegisterForm } from '@/hooks/useRegisterForm';
import EventDetails from './EventDetails';
import RegisterForm1 from './RegisterForm1';
import RegisterForm2 from './RegisterForm2';
import RegisterFormLoading from './RegisterFormLoading';
import RegisterFormError from './RegisterFormError';
import Stepper from './Stepper';
import Summary from './Summary';

// TODO: Add success page
const REGISTER_STEPS = ['EventDetails', 'UserBio', 'PersonalInfo', 'Summary'] as const;
type RegisterSteps = (typeof REGISTER_STEPS)[number];
const REGISTER_STEPS_DISPLAY = ['UserBio', 'PersonalInfo', 'Summary'];

const REGISTER_STEPS_FIELD: { [key: string]: RegisterField[] } = {
  UserBio: ['firstName', 'lastName', 'email', 'contactNumber'],
  PersonalInfo: ['careerStatus', 'organization', 'title']
};

type RegisterField = keyof RegisterFormValues;

const Register = () => {
  const eventId = useParams().eventId;
  const { data: response, isFetching } = useApi(getEvent(eventId!));
  const { form, submit } = useRegisterForm(eventId!);
  const [currentStep, setCurrentStep] = useState<RegisterSteps>(REGISTER_STEPS[0]);

  const oten = true;
  if (oten) {
    return (
      <>
        <RegisterFormLoading />
      </>
    );
  }

  if (!response || (response && !response.data)) {
    return (
      <>
        <RegisterFormError />
      </>
    );
  }

  const eventInfo = response.data;

  const fieldsToCheck: RegisterField[] = REGISTER_STEPS_FIELD[currentStep as keyof typeof REGISTER_STEPS_FIELD];

  const nextStep = async () => {
    const moveToNextStep = () => {
      const currentIndex = REGISTER_STEPS.indexOf(currentStep);
      if (currentIndex < REGISTER_STEPS.length - 1) {
        setCurrentStep(REGISTER_STEPS[currentIndex + 1]);
      }
    };

    if (isEmpty(fieldsToCheck)) {
      moveToNextStep();
    } else {
      await form.trigger(fieldsToCheck).then((isValid) => {
        if (isValid) {
          moveToNextStep();
        }
      });
    }
  };

  const prevStep = () => {
    const currentIndex = REGISTER_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(REGISTER_STEPS[currentIndex - 1]);
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-12 h-12 rounded-full bg-primary-900 dark:bg-primary-100 mb-4" />
        <img style={{ aspectRatio: 4 / 3 }} src={sparcsApplicationimage} />

        <FormProvider {...form}>
          <main className="w-full">
            {currentStep !== 'EventDetails' && <h1 className="text-xl text-center">Register</h1>}
            {currentStep !== 'EventDetails' && <Stepper steps={REGISTER_STEPS_DISPLAY} currentStep={currentStep} />}
            {currentStep === 'EventDetails' && <EventDetails event={eventInfo} />}

            <div className="space-y-4">
              {currentStep === 'UserBio' && <RegisterForm1 />}
              {currentStep === 'PersonalInfo' && <RegisterForm2 />}
            </div>

            {currentStep === 'Summary' && <Summary />}

            <div className="flex w-full justify-around my-4">
              {currentStep === 'EventDetails' && (
                <Button onClick={nextStep} variant={'gradient'}>
                  Register
                </Button>
              )}
              {currentStep !== 'EventDetails' && (
                <Button onClick={prevStep} variant={'outline'}>
                  <Icon name="CaretLeft" />
                  Back
                </Button>
              )}
              {currentStep !== 'EventDetails' && currentStep !== 'Summary' && (
                <Button onClick={nextStep}>
                  Next
                  <Icon name="CaretRight" />
                </Button>
              )}
              {currentStep === 'Summary' && (
                <Button onClick={submit} type="submit">
                  Submit
                </Button>
              )}
            </div>
          </main>
        </FormProvider>
      </div>
    </section>
  );
};

export default Register;
