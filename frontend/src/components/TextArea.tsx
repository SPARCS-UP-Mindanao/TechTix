import * as React from 'react';
import { cn } from '@/utils/classes';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'custard';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, variant = 'default', ...props }, ref) => {
  const variantClass = variant === 'custard' ? 'bg-[#feefdb] text-[#312541] placeholder:text-gray-600' : 'bg-input';

  return (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[100px] w-full rounded-md border border-border px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',

        variantClass,
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
