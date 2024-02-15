import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ExternalLink, Loader2 } from 'lucide-react';
import Icon, { IconName } from '@/components/Icon';
import { cn } from '@/utils/classes';
import { Slot } from '@radix-ui/react-slot';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-50 shadow hover:bg-primary-600',
        negative: 'bg-negative text-negative-foreground shadow-sm hover:bg-negative-600',
        outline: 'border border-border text-primary bg-input shadow-sm hover:border-primary-600 hover:text-primary-600',
        secondaryPink: 'bg-secondary text-primary-50 shadow-sm hover:bg-secondary-pink-600',
        secondaryOrange: 'bg-secondary-orange text-primary-50 shadow-sm hover:bg-secondary-orange-600',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        primaryGradient:
          'bg-gradient-to-r from-primary-500 to-secondary-pink-400 text-white shadow-sm hover:from-primary-700 hover:to-secondary-pink-700 dark:from-primary-500 dark:to-secondary-pink-400 dark:hover:from-primary-700 dark:hover:to-secondary-pink-700',
        secondaryGradient:
          'bg-gradient-to-r from-primary-600 to-primary-400 text-white shadow-sm hover:from-primary-700 hover:to-primary-800 dark:from-secondary-orange-600 dark:to-secondary-orange-400 dark:hover:from-secondary-orange-700 dark:hover:to-secondary-orange-800',
        link: 'text-primary underline-offset-4 hover:underline'
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
  iconPlacement?: 'left' | 'right';
  iconClassname?: string;
  isExternal?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      icon,
      iconClassname,
      iconPlacement = 'left',
      asChild = false,
      loading = false,
      disabled = false,
      isExternal = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const iconStyles = cn('flex-shrink-0', size !== 'icon' && (iconPlacement === 'left' ? 'mr-3' : 'ml-3'), iconClassname, loading && 'animate-spin');

    const getButtonContent = () => {
      if (icon) {
        return (
          <>
            <Icon name={loading ? 'Loader2' : icon} className={iconStyles} />
            {children}
          </>
        );
      }
      return (
        <>
          {loading && <Loader2 className={iconStyles} />}
          {children}
          {isExternal && <ExternalLink className="h-4 w-4" />}
        </>
      );
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }), iconPlacement === 'right' && 'flex-row-reverse')}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {getButtonContent()}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export default Button;
export { buttonVariants };

// Check Icon List here: https://lucide.dev/icons/
