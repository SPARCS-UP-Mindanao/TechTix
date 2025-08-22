import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/classes';
import Icon, { IconName } from './Icon';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive: 'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

function AlertContainer({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="alert-title" className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  );
}

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  title?: string;
  description?: string;
  icon?: IconName;
  closable?: boolean;
}

const Alert = ({ title, description, icon = 'Info', className, children, variant = 'default', closable = false }: AlertProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    ref.current?.remove();
  };

  return (
    <>
      <AlertContainer variant={variant} className={cn('space-x-2', className)} ref={ref}>
        <Icon name={icon} className="h-4 w-4" />
        <AlertTitle>
          {title}
          {closable && (
            <Icon
              name="X"
              onClick={handleDelete}
              className="w-4 h-4 absolute right-0 top-0 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-1 group-hover:opacity-100 cursor-pointer"
            />
          )}
        </AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </AlertContainer>
    </>
  );
};

export default Alert;
export { Alert, AlertTitle, AlertDescription };
