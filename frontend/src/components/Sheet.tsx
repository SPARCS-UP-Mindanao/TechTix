import { ComponentPropsWithoutRef, ElementRef, HTMLAttributes, ReactNode, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import Icon from '@/components/Icon';
import { cn } from '@/utils/classes';
import { Close, Content, Description, DialogPortalProps, Overlay, Portal, Root, Title, Trigger } from '@radix-ui/react-dialog';

const SheetContainer = Root;

const SheetTrigger = Trigger;

const SheetClose = Close;

const SheetPortal = ({ ...props }: DialogPortalProps) => <Portal {...props} />;
SheetPortal.displayName = Portal.displayName;

const SheetOverlay = forwardRef<ElementRef<typeof Overlay>, ComponentPropsWithoutRef<typeof Overlay>>(({ className, ...props }, ref) => (
  <Overlay
    className={cn(
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = Overlay.displayName;

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right: 'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm'
      }
    },
    defaultVariants: {
      side: 'right'
    }
  }
);

interface SheetContentProps extends ComponentPropsWithoutRef<typeof Content>, VariantProps<typeof sheetVariants> {
  closeIconClassName?: string;
}

const SheetContent = forwardRef<ElementRef<typeof Content>, SheetContentProps>(({ side = 'left', className, closeIconClassName, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
      <Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <Icon name="X" className={cn('w-4 h-4', closeIconClassName)} />
        <span className="sr-only">Close</span>
      </Close>
    </Content>
  </SheetPortal>
));
SheetContent.displayName = Content.displayName;

const SheetHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = forwardRef<ElementRef<typeof Title>, ComponentPropsWithoutRef<typeof Title>>(({ className, ...props }, ref) => (
  <Title ref={ref} className={cn('text-lg font-semibold text-foreground', className)} {...props} />
));
SheetTitle.displayName = Title.displayName;

const SheetDescription = forwardRef<ElementRef<typeof Description>, ComponentPropsWithoutRef<typeof Description>>(({ className, ...props }, ref) => (
  <Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
SheetDescription.displayName = Description.displayName;

export { SheetContainer, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };

interface SheetProps extends ComponentPropsWithoutRef<typeof Content> {
  side?: 'left' | 'right' | 'top' | 'bottom';
  closeIconClassName?: string;
  trigger?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  description?: ReactNode;
  sheetClose?: ReactNode;
  defaultOpen?: boolean;
  visible?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sheet = ({
  side = 'left',
  trigger,
  header,
  description,
  footer,
  sheetClose,
  className,
  closeIconClassName,
  children,
  defaultOpen = false,
  visible = false,
  onOpenChange,
  ...props
}: SheetProps) => {
  return (
    <SheetContainer defaultOpen={defaultOpen} open={visible} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side={side} closeIconClassName={closeIconClassName} className={cn('h-max-screen overflow-y-auto', className)} {...props}>
        {(header || description) && (
          <SheetHeader>
            {header && <SheetTitle>{header}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        {children}
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </SheetContainer>
  );
};

export default Sheet;
