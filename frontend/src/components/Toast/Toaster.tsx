import Icon from '@/components/Icon';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/Toast/Toast';
import { useToast } from '@/hooks/useToast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, icon, iconClassname, ...props }) {
        return (
          <Toast key={id} {...props} className="my-1">
            <div className="flex flex-row">
              {icon && (
                <div className="flex mr-5 pt-0.5">
                  <Icon name={icon} className={iconClassname} />
                </div>
              )}
              <div className="grid gap-1">
                {title && <ToastTitle className="text-left">{title}</ToastTitle>}
                {description && <ToastDescription className="text-left">{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
