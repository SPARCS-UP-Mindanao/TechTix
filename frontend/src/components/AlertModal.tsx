import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/Button';
import { cn } from '@/utils/classes';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

const AlertDialogContainer = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = ({ ...props }: AlertDialogPrimitive.AlertDialogPortalProps) => <AlertDialogPrimitive.Portal {...props} />;
AlertDialogPortal.displayName = AlertDialogPrimitive.Portal.displayName;

interface AlertDialogOverlayProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> {
  onClose?: () => void;
}

const AlertDialogOverlay = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Overlay>, AlertDialogOverlayProps>(
  ({ className, onClose, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
      {...props}
      ref={ref}
    />
  )
);
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

interface AlertDialogContentProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  onClose?: () => void;
}

const AlertDialogContent = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Content>, AlertDialogContentProps>(
  ({ className, onClose, ...props }, ref) => (
    <AlertDialogPortal>
      <AlertDialogOverlay onClose={onClose} />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
);
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

interface AlertDialogTitleProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> {
  header?: React.ReactNode;
}

const AlertDialogTitle = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Title>, AlertDialogTitleProps>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => <AlertDialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />);
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

interface AlertDialogActionProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>, VariantProps<typeof buttonVariants> {
  onCompleteAction: () => void;
}

const AlertDialogAction = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Action>, AlertDialogActionProps>(
  ({ className, variant, onCompleteAction, ...props }, ref) => (
    <AlertDialogPrimitive.Action ref={ref} onClick={onCompleteAction} className={cn(buttonVariants({ variant }), className)} {...props} />
  )
);
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

interface AlertDialogCancelProps extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>, VariantProps<typeof buttonVariants> {
  onCancelAction: () => void;
}

const AlertDialogCancel = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Cancel>, AlertDialogCancelProps>(
  ({ className, variant = 'outline', onCancelAction, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel ref={ref} onClick={onCancelAction} className={cn(buttonVariants({ variant }), 'mt-2 sm:mt-0', className)} {...props} />
  )
);
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialogContainer,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
};

interface AlertDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  alertModalTitle?: React.ReactNode;
  alertModalDescription?: React.ReactNode;
  trigger?: React.ReactNode;
  visible?: boolean;
  defaultOpen?: boolean;
  cancelText?: string;
  confirmText?: string;
  cancelVariant?: VariantProps<typeof buttonVariants>['variant'];
  confirmVariant?: VariantProps<typeof buttonVariants>['variant'];
  onOpenChange: (open: boolean) => void;
  onCancelAction?: () => void;
  onCompleteAction: () => void;
}

const AlertModal = ({
  alertModalTitle,
  alertModalDescription,
  trigger,
  visible = false,
  defaultOpen = false,
  cancelText,
  confirmText,
  cancelVariant,
  confirmVariant,
  onOpenChange,
  onCancelAction,
  onCompleteAction
}: AlertDialogProps) => {
  const defaultOnCancelAction = () => onOpenChange(false);

  return (
    <AlertDialogContainer open={visible} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent onClose={() => onOpenChange(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertModalTitle}</AlertDialogTitle>
          <AlertDialogDescription>{alertModalDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant={cancelVariant} onCancelAction={onCancelAction || defaultOnCancelAction}>
            {cancelText ? cancelText : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction variant={confirmVariant} onCompleteAction={onCompleteAction}>
            {confirmText ? confirmText : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogContainer>
  );
};

export default AlertModal;
