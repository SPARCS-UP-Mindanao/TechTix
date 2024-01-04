import { forwardRef, HTMLAttributes, ReactNode, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Icon from '@/components/Icon';
import { cn } from '@/utils/classes';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        negative: 'border-negative/50 text-negative dark:border-negative [&>svg]:text-negative'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const AlertContainer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(
  ({ className, variant, ...props }, ref) => <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
);
AlertContainer.displayName = 'Alert';

const AlertTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'negative';
  title?: string;
  description?: string;
  icon?: ReactNode;
  closable?: boolean;
}

const Alert = ({ title, description, icon, className, children, variant = 'default', closable = false }: AlertProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    ref.current?.remove();
  };

  return (
    <AlertContainer variant={variant} className={className} ref={ref}>
      {typeof icon === 'string' ? <Icon name={icon} className="h-4 w-4" /> : icon}
      <div>
        <div>
          {title && <AlertTitle>{title}</AlertTitle>}
          {closable && (
            <Icon
              name="X"
              onClick={handleDelete}
              size={24}
              className="absolute right-0 top-0 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 cursor-pointer"
            />
          )}
        </div>
        {description && <AlertDescription>{description}</AlertDescription>}
        {children}
      </div>
    </AlertContainer>
  );
};

export default Alert;
export { AlertContainer, AlertTitle, AlertDescription };
