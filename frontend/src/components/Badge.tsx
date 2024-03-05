import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/classes';
import Icon from './Icon';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary-700',
        secondaryPink: 'border-transparent bg-secondary-pink text-secondary-foreground hover:bg-secondary-pink-700',
        secondaryOrange: 'border-transparent bg-secondary-orange text-secondary-foreground hover:bg-secondary-orange-700',
        negative: 'border-transparent bg-negative text-negative-foreground shadow hover:bg-negative-900 dark:hover:bg-negative-700',
        positive: 'border-transparent bg-positive text-positive-foreground shadow hover:bg-positive-600',
        outline: 'text-foreground border-primary text-primary'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  loading?: boolean;
}

function Badge({ className, variant, onClick, children, loading = false, ...props }: BadgeProps) {
  return (
    <div
      onClick={onClick}
      className={cn(badgeVariants({ variant }), 'flex justify-center items-center p-2', className, onClick && 'cursor-pointer')}
      {...props}
    >
      {loading && <Icon name="Loader2" className="w-3 h-3 animate-spin mr-1" />}
      {children}
    </div>
  );
}

export { badgeVariants };
export default Badge;
