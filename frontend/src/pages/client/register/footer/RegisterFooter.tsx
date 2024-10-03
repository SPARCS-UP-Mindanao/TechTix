import { FC } from 'react';
import Button from '@/components/Button';
import { Event } from '@/model/events';
import { RegisterField } from '@/hooks/useRegisterForm';
import { RegisterStep } from '../steps/RegistrationSteps';
import { useRegisterFooter } from './useRegisterFooter';

interface Props {
  event: Event;
  steps: RegisterStep[];
  currentStep: RegisterStep;
  fieldsToCheck: RegisterField[];
  isRegisterSuccessful: boolean;
  setCurrentStep: (step: RegisterStep) => void;
  retryRegister: () => void;
  isTransactionFeeLoading: boolean;
}

const RegisterFooter: FC<Props> = ({
  event,
  steps,
  currentStep,
  fieldsToCheck,
  isRegisterSuccessful,
  setCurrentStep,
  retryRegister,
  isTransactionFeeLoading
}) => {
  const {
    paymentButtonDisabled,
    isValidatingEmail,
    isFormSubmitting,
    onNextStep,
    onPrevStep,
    onStartRegister,
    onCheckEmailNextStep,
    onSummaryStep,
    onSignUpOther,
    onSubmitForm
  } = useRegisterFooter(event, steps, currentStep, fieldsToCheck, setCurrentStep);
  const eventDetailsFooter = () => {
    return (
      <Button onClick={onStartRegister} icon="ChevronRight" iconPlacement="right" className="py-6 sm:px-10">
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
    if (event.isApprovalFlow && event.status === 'open') {
      return summaryFooter();
    }

    return (
      <>
        <Button onClick={onPrevStep} icon="ChevronLeft" className="py-6 sm:px-6">
          Back
        </Button>
        <Button
          onClick={onSummaryStep}
          disabled={paymentButtonDisabled}
          loading={isTransactionFeeLoading}
          icon="ChevronRight"
          iconPlacement="right"
          className="py-6 sm:px-6"
        >
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
        {event.isApprovalFlow && event.status === 'open' ? (
          <Button
            onClick={onSubmitForm}
            disabled={paymentButtonDisabled}
            loading={isFormSubmitting}
            icon="ChevronRight"
            iconPlacement="right"
            className="py-6 sm:px-6"
          >
            Proceed to Payment
          </Button>
        ) : (
          <Button onClick={onSubmitForm} loading={isFormSubmitting} icon="ChevronRight" iconPlacement="right" className="py-6 sm:px-6">
            Submit
          </Button>
        )}
      </>
    );
  };

  const successFooter = () => {
    if (!isRegisterSuccessful) {
      return (
        <Button icon="RotateCw" onClick={retryRegister} className="py-6 sm:px-8">
          Retry submitting registration
        </Button>
      );
    }

    return (
      <Button onClick={onSignUpOther} className="py-6 sm:px-8">
        Sign up another person
      </Button>
    );
  };

  return (
    <footer className="flex w-full justify-around my-6">
      {currentStep.id === 'EventDetails' && eventDetailsFooter()}
      {currentStep.id === 'UserBio' && userBioFooter()}
      {currentStep.id === 'PersonalInfo' && personalInformationFooter()}
      {currentStep.id === 'Payment' && paymentFooter()}
      {currentStep.id === 'Summary' && summaryFooter()}
      {currentStep.id === 'Success' && successFooter()}
    </footer>
  );
};

export default RegisterFooter;
