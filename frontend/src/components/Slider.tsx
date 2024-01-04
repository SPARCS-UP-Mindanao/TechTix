import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { cn } from '@/utils/classes';
import { Root, Thumb, Track, Range } from '@radix-ui/react-slider';

const Slider = forwardRef<ElementRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center cursor-pointer data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary-200 dark:bg-background-100">
      <Range className="absolute h-full bg-primary" />
    </Track>
    <Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    <Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </Root>
));
Slider.displayName = Root.displayName;

export default Slider;
