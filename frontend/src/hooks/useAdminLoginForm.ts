import { AuthError, signIn } from 'aws-amplify/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigateTo } from '@/hooks/useNavigateTo';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useCurrentAdminUser } from './useCurrentUser';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginFormSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address'
  }),
  password: z.string().min(8, {
    message: 'Please enter at least 8 characters'
  })
});

export const useAdminLoginForm = () => {
  const auth = useCurrentAdminUser();
  const { errorToast } = useNotifyToast();
  const { navigate } = useNavigateTo();

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
      await signIn({
        username: email,
        password
      });
      await auth.refetchUser?.();
      navigate('/admin/events');
    } catch (e) {
      if (e instanceof AuthError) {
        errorToast({
          id: 'sign-in-error',
          title: 'There was a problem signing in.',
          description: e.message
        });
        throw Error(e.message);
      } else {
        console.error(e);
        throw Error();
      }
    }
  });

  return {
    form,
    submit,
    isSubmitting: form.formState.isSubmitting
  };
};
