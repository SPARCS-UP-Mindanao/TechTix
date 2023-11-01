import { useSignIn } from 'react-auth-kit';
import { useForm } from 'react-hook-form';
import { setCookie } from 'typescript-cookie';
import { z } from 'zod';
import { loginUser } from '@/api/auth';
import { CustomAxiosError } from '@/api/utils/createApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
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

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submit = form.handleSubmit(async ({ email, password }) => {
    try {
      const { queryFn: login } = loginUser(email, password);
      const response = await login();

      if (response.status === 200) {
        setCookie('_auth_user', response.data.authState?.userId, { expires: 30 });
        signIn(response.data);
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
    submit
  };
};
