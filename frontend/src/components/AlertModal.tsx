import { ComponentPropsWithoutRef, forwardRef, ElementRef, HTMLAttributes, ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/Button';
import { cn } from '@/utils/classes';
import { Action, AlertDialogPortalProps, Cancel, Content, Description, Overlay, Portal, Root, Title, Trigger } from '@radix-ui/react-alert-dialog';

const AlertDialogContainer = Root;

const AlertDialogTrigger = Trigger;

const AlertDialogPortal = ({ ...props }: AlertDialogPortalProps) => <Portal {...props} />;
AlertDialogPortal.displayName = Portal.displayName;

interface AlertDialogOverlayProps extends ComponentPropsWithoutRef<typeof Overlay> {
  onClose?: () => void;
}

const AlertDialogOverlay = forwardRef<ElementRef<typeof Overlay>, AlertDialogOverlayProps>(({ className, onClose, ...props }, ref) => (
  <Overlay
    onClick={onClose}
    className={cn(
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = Overlay.displayName;

interface AlertDialogContentProps extends ComponentPropsWithoutRef<typeof Content> {
  onClose?: () => void;
}

const AlertDialogContent = forwardRef<ElementRef<typeof Content>, AlertDialogContentProps>(({ className, onClose, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay onClose={onClose} />
    <Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = Content.displayName;

const AlertDialogHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

interface AlertDialogTitleProps extends ComponentPropsWithoutRef<typeof Title> {
  header?: ReactNode;
}

const AlertDialogTitle = forwardRef<ElementRef<typeof Title>, AlertDialogTitleProps>(({ className, ...props }, ref) => (
  <Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));
AlertDialogTitle.displayName = Title.displayName;

const AlertDialogDescription = forwardRef<ElementRef<typeof Description>, ComponentPropsWithoutRef<typeof Description>>(({ className, ...props }, ref) => (
  <Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
AlertDialogDescription.displayName = Description.displayName;

interface AlertDialogActionProps extends ComponentPropsWithoutRef<typeof Action>, VariantProps<typeof buttonVariants> {
  onCompleteAction: () => void;
}

const AlertDialogAction = forwardRef<ElementRef<typeof Action>, AlertDialogActionProps>(({ className, variant, onCompleteAction, ...props }, ref) => (
  <Action ref={ref} onClick={onCompleteAction} className={cn(buttonVariants({ variant }), className)} {...props} />
));
AlertDialogAction.displayName = Action.displayName;

interface AlertDialogCancelProps extends ComponentPropsWithoutRef<typeof Cancel>, VariantProps<typeof buttonVariants> {
  onCancelAction: () => void;
}

const AlertDialogCancel = forwardRef<ElementRef<typeof Cancel>, AlertDialogCancelProps>(({ className, variant = 'outline', onCancelAction, ...props }, ref) => (
  <Cancel ref={ref} onClick={onCancelAction} className={cn(buttonVariants({ variant }), 'mt-2 sm:mt-0', className)} {...props} />
));
AlertDialogCancel.displayName = Cancel.displayName;

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

interface AlertDialogProps extends HTMLAttributes<HTMLDivElement> {
  alertModalTitle?: ReactNode;
  alertModalDescription?: ReactNode;
  trigger?: ReactNode;
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
