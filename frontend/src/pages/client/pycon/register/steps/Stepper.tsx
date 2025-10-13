import { Fragment } from 'react';
import durian from '@/assets/pycon/durian.png';
import { cn } from '@/utils/classes';

export interface Step {
  id: string;
  title?: string;
  description?: string;
}

interface StepperProps<T extends Step> {
  steps: T[];
  currentStep: T;
  stepsToExclude?: T[];
  onStepClick?: (step: T) => void;
  orientation?: 'horizontal' | 'vertical';
  hideTitle?: boolean;
}

const STEP_CIRCLE_SIZE = '1.5rem';

const Stepper = <T extends Step>({ steps, currentStep, stepsToExclude, onStepClick, orientation = 'horizontal', hideTitle = false }: StepperProps<T>) => {
  const visibleSteps = steps.filter((step) => step.title && !stepsToExclude?.some((excludeStep) => excludeStep.id === step.id));
  const showTitle = orientation === 'vertical' && !hideTitle;
  const currentStepIndex = visibleSteps.indexOf(currentStep);

  return (
    <div className={cn('flex items-center justify-center w-full h-full', orientation === 'vertical' ? 'flex-col' : 'flex-row')}>
      {visibleSteps.map((step, index) => {
        const isCurrentStepOrDone = currentStepIndex >= index;
        const stepBackground = isCurrentStepOrDone ? 'bg-pycon-custard' : 'bg-pycon-custard-light';
        const connectorBackground = currentStepIndex > index ? 'bg-pycon-custard' : 'bg-pycon-custard-light';

        const isLastStep = index === visibleSteps.length - 1;

        return (
          <Fragment key={`steps.id-${index}`}>
            <div style={{ width: STEP_CIRCLE_SIZE, height: STEP_CIRCLE_SIZE }} className="relative bg-transparent">
              <div
                style={{ width: STEP_CIRCLE_SIZE, height: STEP_CIRCLE_SIZE }}
                className={cn('select-none rounded-[6px] rotate-45 transition-colors', stepBackground, onStepClick && 'cursor-pointer')}
                onClick={onStepClick ? () => onStepClick(step) : undefined}
              ></div>
              {currentStepIndex === index && <img src={durian} className="w-10 scale-150 absolute inset-0 z-5" alt="" />}

              {showTitle && <div className="absolute inset-0 z-6 ms-16 flex items-center">{step.title}</div>}
            </div>

            {!isLastStep && <div className={cn('transition-colors', connectorBackground, orientation === 'horizontal' ? 'h-1 flex-1' : 'w-1 flex-1')} />}
          </Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
