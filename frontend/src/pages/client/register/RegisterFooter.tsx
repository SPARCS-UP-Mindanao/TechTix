import { FC } from 'react';
import Button from '@/components/Button';
import { Event } from '@/model/events';
import { RegisterField } from '@/hooks/useRegisterForm';
import { RegisterStep } from './Steps';
import { useRegisterFooter } from './useRegisterFooter';

interface Props {
  event: Event;
  steps: RegisterStep[];
  currentStep: RegisterStep;
  fieldsToCheck: RegisterField[];
  setCurrentStep: (step: RegisterStep) => void;
}

const RegisterFooter: FC<Props> = ({ event, steps, currentStep, fieldsToCheck, setCurrentStep }) => {
  const {
    paymentButtonDisabled,
    isValidatingEmail,
    isFormSubmitting,
    onNextStep,
    onPrevStep,
    onCheckEmailNextStep,
    onSummaryStep,
    onSignUpOther,
    onSubmitForm
  } = useRegisterFooter(event, steps, currentStep, fieldsToCheck, setCurrentStep);
  const eventDetailsFooter = () => {
    return (
      <Button onClick={onNextStep} icon="ChevronRight" iconPlacement="right" className="py-6 sm:px-10">
        Register
      </Button>
    );
  };

  const userBioFooter = () => {
    return (
      <>
        <Button onClick={onPrevStep} disabled={isValidatingEmail} icon="ChevronLeft" className="py-6 sm:px-6">
          Back
        </Button>
        <Button onClick={onCheckEmailNextStep} loading={isValidatingEmail} icon="ChevronRight" iconPlacement="right" className="py-6 sm:px-6">
          Next
        </Button>
      </>
    );
  };

  const personalInformationFooter = () => {
    return (
      <>
        <Button onClick={onPrevStep} icon="ChevronLeft" className="py-6 sm:px-6">
          Back
        </Button>
        <Button onClick={onNextStep} icon="ChevronRight" iconPlacement="right" className="py-6 sm:px-6">
          Next
        </Button>
      </>
    );
  };

  const paymentFooter = () => {
    return (
      <>
        <Button onClick={onPrevStep} icon="ChevronLeft" className="py-6 sm:px-6">
          Back
        </Button>
        <Button onClick={onSummaryStep} disabled={paymentButtonDisabled} icon="ChevronRight" iconPlacement="right" className="py-6 sm:px-6">
          Next
        </Button>
      </>
    );
  };

  const summaryFooter = () => {
    return (
      <>
        <Button onClick={onPrevStep} disabled={isFormSubmitting} icon="ChevronLeft" className="py-6 sm:px-6">
          Back
        </Button>
        <Button onClick={onSubmitForm} loading={isFormSubmitting} icon="ChevronRight" iconPlacement="right" className="py-6 sm:px-6">
          Submit
        </Button>
      </>
    );
  };

  const successFooter = () => {
    return (
      <Button onClick={onSignUpOther} className="py-6 sm:px-8">
        Sign up another person
      </Button>
    );
  };

  return (
    <div className="flex w-full justify-around my-6">
      {currentStep.id === 'EventDetails' && eventDetailsFooter()}
      {currentStep.id === 'UserBio' && userBioFooter()}
      {currentStep.id === 'PersonalInfo' && personalInformationFooter()}
      {currentStep.id === 'Payment' && paymentFooter()}
      {currentStep.id === 'Summary' && summaryFooter()}
      {currentStep.id === 'Success' && successFooter()}
    </div>
  );
};

export default RegisterFooter;
