import { useToast } from "@/hooks/useToast";

interface ToastProps {
  title?: string;
  description?: string;
  icon?: string;
}

export const useNotifyToast = () => {
  const { toast } = useToast();

  const infoToast = ({
    title = "Info",
    description,
    icon = "Info",
  }: ToastProps) =>
    toast({
      title,
      description,
      icon,
    });

  const successToast = ({
    title = "Success",
    description,
    icon = "Success",
  }: ToastProps) =>
    toast({
      title,
      description,
      icon,
    });

  const errorToast = ({
    title = "Error",
    description,
    icon = "Error",
  }: ToastProps) =>
    toast({
      title,
      description,
      icon,
    });

  return {
    infoToast,
    successToast,
    errorToast,
  };
};
