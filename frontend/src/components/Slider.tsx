import * as React from 'react';
import durian from '@/assets/pycon/durian.png';
import { cn } from '@/utils/classes';
import * as SliderPrimitive from '@radix-ui/react-slider';

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center cursor-pointer data-disabled:pointer-events-none data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full dark:bg-background-100 bg-pycon-custard-light">
        <SliderPrimitive.Range className="absolute h-full bg-pycon-orange" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-8 w-8 bg-cover bg-center transition-transform hover:scale-110 focus-visible:outline-none disabled:opacity-50"
        style={{ backgroundImage: `url(${durian})` }}
      />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export default Slider;
