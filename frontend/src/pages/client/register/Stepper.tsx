import { cn } from '@/utils/classes';
import { RegisterStep } from './Steps';
import * as Slider from '@radix-ui/react-slider';

interface StepperProps {
  steps: RegisterStep[];
  currentStep: RegisterStep;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  const visibleSteps = steps.filter((step) => step.title && step.id !== 'Success');
  const interval = 100 / (visibleSteps.length - 1);
  const arrayOfValues = visibleSteps.map((_, index) => index * interval);

  return (
    <div className="my-8">
      <Slider.Root
        className="relative flex w-full touch-none select-none items-center cursor-pointer data-[disabled]:pointer-events-none"
        value={arrayOfValues}
        max={100}
        step={interval}
      >
        <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary">
          <Slider.Range className="absolute h-full bg-primary px-1" />
        </Slider.Track>
        {visibleSteps.map((step, index) => (
          <Slider.Thumb
            className={cn(
              'flex items-center justify-center h-8 w-8 rounded-full font-subjectivity bg-neutrals-200 text-primary transition-colors disabled:pointer-events-none',
              step.id === currentStep.id && 'bg-primary text-neutral-200'
            )}
            key={step.id}
          >
            {index + 1}
          </Slider.Thumb>
        ))}
      </Slider.Root>
    </div>
  );
};

export default Stepper;
