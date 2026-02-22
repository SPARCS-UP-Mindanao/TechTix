import * as React from 'react';
import { cn } from '@/utils/classes';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  pyconStyles?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, pyconStyles = false, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'text-foreground flex h-9 w-full rounded-md border border-border bg-input px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        pyconStyles && 'bg-pycon-dirty-white placeholder:text-pycon-lavender text-pycon-violet font-nunito',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export default Input;
