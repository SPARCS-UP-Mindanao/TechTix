import { FC, JSX } from 'react';
import Button from '@/components/Button';
import { Event } from '@/model/events';
import { RegisterField } from '../../hooks/useRegisterForm';
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
  isFeesLoading: boolean;
}

const RegisterFooter: FC<Props> = ({ event, steps, currentStep, fieldsToCheck, isRegisterSuccessful, setCurrentStep, retryRegister, isFeesLoading }) => {
  const {
    paymentButtonDisabled,
    isFormSubmitting,
    onNextStep,
    onPrevStep,

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

  const defaultFooter = () => {
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
          loading={isFeesLoading}
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

  const footerButtons: Record<RegisterStep['id'], () => JSX.Element> = {
    EventDetails: eventDetailsFooter,
    BasicInfo: defaultFooter,
    TicketSelection: defaultFooter,
    Miscellaneous: defaultFooter,
    'Payment&Verification': paymentFooter,
    Summary: summaryFooter,
    Success: successFooter
  };

  return <footer className="flex w-full justify-around my-6">{footerButtons[currentStep.id]()}</footer>;
};

export default RegisterFooter;
