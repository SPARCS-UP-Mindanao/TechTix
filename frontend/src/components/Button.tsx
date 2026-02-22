import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import Icon, { IconName } from '@/components/Icon';
import { cn } from '@/utils/classes';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-50 shadow-sm hover:bg-primary-600',
        negative: 'bg-negative text-negative-foreground shadow-xs hover:bg-negative-600',
        positive: 'bg-positive text-positive-foreground shadow-xs hover:bg-positive-600',
        outline: 'border border-border text-primary bg-input shadow-xs hover:border-primary-600 hover:text-primary-600',
        secondaryPink: 'bg-secondary text-primary-50 shadow-xs hover:bg-secondary-pink-600',
        secondaryOrange: 'bg-secondary-orange text-primary-50 shadow-xs hover:bg-secondary-orange-600',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        primaryGradient:
          'bg-linear-to-r from-primary-500 to-secondary-pink-400 text-white shadow-xs hover:from-primary-700 hover:to-secondary-pink-700 dark:from-primary-500 dark:to-secondary-pink-400 dark:hover:from-primary-700 dark:hover:to-secondary-pink-700',
        secondaryGradient:
          'bg-linear-to-r from-primary-600 to-primary-400 text-white shadow-xs hover:from-primary-700 hover:to-primary-800 dark:from-secondary-orange-600 dark:to-secondary-orange-400 dark:hover:from-secondary-orange-700 dark:hover:to-secondary-orange-800',
        link: 'text-primary underline-offset-4 hover:underline',
        primaryGradientNoHover: 'bg-linear-to-r from-primary-500 to-secondary-pink-400 text-white shadow-xs'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      },
      loading: {
        true: 'pointer-events-none'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: IconName;
  strokeWidth?: number;
  iconPlacement?: 'left' | 'right';
  iconClassname?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      icon,
      strokeWidth,
      iconClassname,
      iconPlacement = 'left',
      asChild = false,
      loading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const iconStyles = cn('shrink-0', size !== 'icon' && children && (iconPlacement === 'left' ? 'mr-3' : 'ml-3'), iconClassname, loading && 'animate-spin');

    const getButtonContent = () => {
      if (icon) {
        return (
          <>
            <Icon strokeWidth={strokeWidth} name={loading ? 'LoaderCircle' : icon} className={iconStyles} />
            {children}
          </>
        );
      }
      return (
        <>
          {loading && <Loader2 className={iconStyles} />}
          {children}
        </>
      );
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, loading, className }), iconPlacement === 'right' && 'flex-row-reverse')}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {getButtonContent()}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
export { buttonVariants };

// Check Icon List here: https://lucide.dev/icons/
