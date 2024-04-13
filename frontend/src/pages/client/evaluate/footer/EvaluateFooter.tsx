import Button from '@/components/Button';
import { Event } from '@/model/events';
import { EvaluateStep } from '../steps/EvaluationSteps';
import useEvaluateFooter from './useEvaluateFooter';

interface Props<T extends string> {
  event: Event;
  steps: EvaluateStep[];
  currentStep: EvaluateStep;
  fieldsToCheck: T[];
  setCurrentStep: (step: EvaluateStep) => void;
  submitForm: () => Promise<void>;
}

const EvaluateFooter = <T extends string>({ event, steps, currentStep, fieldsToCheck, setCurrentStep, submitForm }: Props<T>) => {
  const { isValidatingEmail, isFormSubmitting, onNextStep, onPrevStep, onStartEvaluate, onSubmit } = useEvaluateFooter(
    event,
    steps,
    currentStep,
    fieldsToCheck,
    setCurrentStep,
    submitForm
  );

  if (currentStep.id === 'ClaimCertificate') {
    return <></>;
  }

  const eventDetailsFooter = () => {
    return (
      <Button loading={isValidatingEmail} onClick={onStartEvaluate} icon="ChevronRight" iconPlacement="right" className="py-6 sm:px-10">
        Evaluate
      </Button>
    );
  };

  const evaluationFooter = () => {
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

  const submitFooter = () => {
    return (
      <>
        <Button onClick={onPrevStep} disabled={isFormSubmitting} icon="ChevronLeft" className="py-6 sm:px-6">
          Back
        </Button>
        <Button onClick={async () => onSubmit()} loading={isFormSubmitting} icon="ChevronRight" iconPlacement="right" className="py-6 sm:px-6">
          Submit
        </Button>
      </>
    );
  };

  return (
    <footer className="flex w-full justify-around my-6">
      {currentStep.id === 'EventDetails' && eventDetailsFooter()}
      {currentStep.id === 'Evaluation_1' && evaluationFooter()}
      {currentStep.id === 'Evaluation_2' && submitFooter()}
    </footer>
  );
};

export default EvaluateFooter;
