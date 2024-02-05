import { cn } from '@/utils/classes';
import * as Slider from '@radix-ui/react-slider';

interface StepperProps {
  steps: string[];
  currentStep: string;
}
const Stepper = ({ steps, currentStep }: StepperProps) => {
  const interval = 100 / (steps.length - 1);
  const arrayOfValues = steps.map((_, index) => index * interval);
  return (
    <div className="my-8 w-full">
      <Slider.Root
        className="relative flex w-full touch-none select-none items-center cursor-pointer data-[disabled]:pointer-events-none"
        value={arrayOfValues}
        max={100}
        step={interval}
      >
        <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary">
          <Slider.Range className="absolute h-full bg-primary px-1" />
        </Slider.Track>
        {steps.map((step, index) => (
          <Slider.Thumb
            className={cn(
              'flex items-center justify-center h-8 w-8 rounded-full font-subjectivity bg-neutrals-200 text-primary transition-colors disabled:pointer-events-none',
              step === currentStep && 'bg-primary text-neutral-200'
            )}
            key={step}
          >
            {index + 1}
          </Slider.Thumb>
        ))}
      </Slider.Root>
    </div>
  );
};

export default Stepper;
