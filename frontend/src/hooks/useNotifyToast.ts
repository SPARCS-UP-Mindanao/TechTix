import { IconName } from '@/components/Icon';
import { useToast } from '@/hooks/useToast';

interface ToastProps {
  title?: string;
  description?: string;
  icon?: IconName;
  iconClassname?: string;
  duration?: number;
}

export const useNotifyToast = () => {
  const { toast } = useToast();

  const infoToast = ({ title = 'Info', description, icon = 'Info', iconClassname, duration = 5000 }: ToastProps) =>
    toast({
      title,
      description,
      icon,
      iconClassname,
      duration
    });

  const successToast = ({ title = 'Success', description, icon = 'CheckCircle', iconClassname = 'text-green-400', duration = 5000 }: ToastProps) =>
    toast({
      title,
      description,
      icon,
      iconClassname,
      duration
    });

  const errorToast = ({ title = 'Error', description, icon = 'XCircle', iconClassname = 'text-negative', duration = 5000 }: ToastProps) =>
    toast({
      title,
      description,
      icon,
      iconClassname,
      duration
    });

  return {
    infoToast,
    successToast,
    errorToast
  };
};
