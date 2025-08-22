import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import Button, { buttonVariants } from '@/components/Button';
import { cn } from '@/utils/classes';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

function AlertDialogContainer({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}
function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}
function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}
function AlertDialogOverlay({
  className,
  onClose,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay> & {
  onClose?: () => void;
}) {
  return (
    <AlertDialogPrimitive.Overlay
      onClick={onClose}
      data-slot="alert-dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  );
}
function AlertDialogContent({
  className,
  onClose,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  onClose?: () => void;
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay onClose={onClose} />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}
function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="alert-dialog-header" className={cn('flex flex-col gap-2 text-center sm:text-left', className)} {...props} />;
}
function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="alert-dialog-footer" className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />;
}
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title> & {
  header?: React.ReactNode;
}) {
  return <AlertDialogPrimitive.Title data-slot="alert-dialog-title" className={cn('text-lg font-semibold', className)} {...props} />;
}
function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return <AlertDialogPrimitive.Description data-slot="alert-dialog-description" className={cn('text-muted-foreground text-sm', className)} {...props} />;
}
function AlertDialogAction({
  className,
  onCompleteAction,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  VariantProps<typeof buttonVariants> & {
    onCompleteAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) {
  return <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} onClick={onCompleteAction} {...props} />;
}
function AlertDialogCancel({
  className,
  onCancelAction,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  VariantProps<typeof buttonVariants> & {
    onCancelAction: () => void;
  }) {
  return <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant: 'outline' }), className)} onClick={onCancelAction} {...props} />;
}

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
  isLoading?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onCancelAction?: () => void;
  onCompleteAction: () => void;
}

const AlertModal = ({
  alertModalTitle,
  alertModalDescription,
  trigger,
  visible,
  defaultOpen = false,
  cancelText,
  confirmText,
  cancelVariant,
  confirmVariant,
  isLoading,
  onClose,
  onOpenChange,
  onCancelAction,
  onCompleteAction
}: AlertDialogProps) => {
  const noLoading = isLoading === undefined;
  const defaultOnCancelAction = () => onOpenChange && onOpenChange(false);
  const onComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!noLoading) {
      e.preventDefault();
    }
    onCompleteAction();
  };
  return (
    <AlertDialogContainer open={visible} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent onClose={noLoading || isLoading ? undefined : onClose || defaultOnCancelAction}>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertModalTitle}</AlertDialogTitle>
          <AlertDialogDescription>{alertModalDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} variant={cancelVariant} onCancelAction={onCancelAction || defaultOnCancelAction}>
            {cancelText ? cancelText : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction variant={confirmVariant} onCompleteAction={onComplete} asChild>
            <Button loading={isLoading}>{confirmText ? confirmText : 'Confirm'}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogContainer>
  );
};

export default AlertModal;
