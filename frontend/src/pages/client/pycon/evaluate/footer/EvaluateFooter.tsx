import Button from '@/components/Button';
import { Event } from '@/model/events';
import { EventFooterPortal } from '../../register/footer/EventFooterPortal';
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
  const { isFormSubmitting, onNextStep, onPrevStep, onStartEvaluate, onSubmit } = useEvaluateFooter(
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
      <EventFooterPortal>
        <Button
          onClick={onStartEvaluate}
          icon="ChevronRight"
          iconPlacement="right"
          iconClassname="stroke-pycon-violet!"
          className="cursor-pointer gap-x-2 bg-pycon-custard-light text-pycon-violet! rounded-full hover:bg-pycon-custard py-6 sm:px-10 my-8"
        >
          Evaluate
        </Button>
      </EventFooterPortal>
    );
  };

  const evaluationFooter = () => {
    return (
      <>
        <Button
          onClick={onPrevStep}
          icon="ChevronLeft"
          strokeWidth={3}
          className="bg-transparent border border-pycon-custard-light text-pycon-custard-light font-medium rounded-full py-6 sm:px-6 hover:bg-pycon-custard-light cursor-pointer hover:text-pycon-violet"
        >
          Back
        </Button>
        <Button
          onClick={onNextStep}
          icon="ChevronRight"
          strokeWidth={3}
          iconPlacement="right"
          className="bg-pycon-custard-light hover:bg-pycon-custard cursor-pointer  text-pycon-violet rounded-full py-6 sm:px-6"
        >
          Next
        </Button>
      </>
    );
  };

  const submitFooter = () => {
    return (
      <>
        <Button
          onClick={onPrevStep}
          icon="ChevronLeft"
          strokeWidth={3}
          className="bg-transparent border border-pycon-custard-light text-pycon-custard-light font-medium rounded-full py-6 sm:px-6 hover:bg-pycon-custard-light cursor-pointer hover:text-pycon-violet"
        >
          Back
        </Button>
        <Button
          onClick={async () => onSubmit()}
          loading={isFormSubmitting}
          icon="ChevronRight"
          iconPlacement="right"
          className="bg-pycon-custard-light hover:bg-pycon-custard cursor-pointer  text-pycon-violet rounded-full py-6 sm:px-6"
        >
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
