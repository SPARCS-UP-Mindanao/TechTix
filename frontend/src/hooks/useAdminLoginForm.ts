import { useSignIn } from 'react-auth-kit';
import { useForm } from 'react-hook-form';
import { setCookie } from 'typescript-cookie';
import { z } from 'zod';
import { loginUser } from '@/api/auth';
import { CustomAxiosError } from '@/api/utils/createApi';
import { cookieConfiguration } from '@/utils/cookies';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string().min(8, {
    message: 'Please enter at least 8 characters'
  })
});

export const useAdminLoginForm = () => {
  const { errorToast } = useNotifyToast();
  const signIn = useSignIn();
  const api = useApi();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submit = form.handleSubmit(async ({ email, password }) => {
    try {
      const loginResponse = await api.execute(loginUser(email, password));

      if (loginResponse.status === 200) {
        setCookie('_auth_user', loginResponse.data.authState?.userId, cookieConfiguration);
        signIn(loginResponse.data);
      } else {
        const { errorData } = loginResponse as CustomAxiosError;
        errorToast({
          title: 'Error in logging in',
          description: errorData.message || errorData.detail[0].msg
        });
        form.setError('email', {
          type: 'custom',
          message: errorData.message || errorData.detail[0].msg
        });
        form.setError('password', {
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
