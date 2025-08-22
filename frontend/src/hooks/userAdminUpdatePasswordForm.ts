import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updatePassword } from '@/api/auth';
import { CustomAxiosError } from '@/api/utils/createApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

const UpdatePasswordFormSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address'
  }),
  prevPassword: z.string().min(8, {
    message: 'Please enter at least 8 characters'
  }),
  newPassword: z.string().min(8, {
    message: 'Please enter at least 8 characters'
  })
});

export const useAdminUpdatePasswordForm = (onSuccess: () => void) => {
  const { errorToast, successToast } = useNotifyToast();
  const api = useApi();

  const form = useForm<z.infer<typeof UpdatePasswordFormSchema>>({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: {
      email: '',
      prevPassword: '',
      newPassword: ''
    }
  });

  const submit = form.handleSubmit(async ({ email, prevPassword, newPassword }) => {
    try {
      const response = await api.execute(updatePassword(email, prevPassword, newPassword));

      if (response.status === 200) {
        successToast({
          title: 'Password updated successfully',
          description: 'Login with your new password'
        });
        onSuccess();
      } else {
        const { errorData } = response as CustomAxiosError;
        errorToast({
          title: 'Error in logging in',
          description: errorData.message || errorData.detail[0].msg
        });
        form.setError('email', {
          type: 'custom',
          message: errorData.message || errorData.detail[0].msg
        });
        form.setError('prevPassword', {
          type: 'custom',
          message: errorData.message || errorData.detail[0].msg
        });
        form.setError('newPassword', {
          type: 'custom',
          message: errorData.message || errorData.detail[0].msg
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in logging in',
        description: errorData.message || errorData.detail[0].msg
      });
    }
  });

  return {
    form,
    submit,
    isSubmitting: form.formState.isSubmitting
  };
};
