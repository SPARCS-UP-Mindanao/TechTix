import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { resetPassword, sendCodeForForgotPassword } from '@/api/auth';
import { CustomAxiosError } from '@/api/utils/createApi';
import { ResetModalSteps } from '@/pages/admin/login/LoginForm';
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';
import { zodResolver } from '@hookform/resolvers/zod';

const ForgetPasswordSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address'
  }),
  confirmationCode: z.string(),
  newPassword: z.string().min(8, {
    message: 'Please enter at least 8 characters'
  }),
  confirmPassword: z.string().min(8, {
    message: 'Please enter at least 8 characters'
  })
});

export type ForgetPasswordForm = z.infer<typeof ForgetPasswordSchema>;

export const useForgetPassword = (setStep: Dispatch<SetStateAction<ResetModalSteps>>) => {
  const { successToast, errorToast } = useNotifyToast();
  const [showModal, setShowModal] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const api = useApi();

  const form = useForm<ForgetPasswordForm>({
    mode: 'onChange',
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email: '',
      confirmationCode: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const toggleModal = (show: boolean) => {
    setShowModal(show);
    setStep('email');
    form.reset();
  };

  const email = form.watch('email');
  const sendCodeToEmail = async () => {
    try {
      setIsEmailSubmitting(true);
      const response = await api.execute(sendCodeForForgotPassword(email));
      if (response.status === 200) {
        setStep('submit');
      }
    } catch (error) {
      const { errorData } = error as CustomAxiosError;
      errorToast({
        title: 'Error in sending code',
        description: errorData.message || errorData.detail[0].msg
      });
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const submit = form.handleSubmit(async ({ email, confirmationCode, newPassword }) => {
    try {
      const response = await api.execute(resetPassword(email, confirmationCode, newPassword));
      if (response.status === 200) {
        setShowModal(false);
        successToast({
          title: 'Password reset successfully',
          description: 'Your password has been reset successfully. Please try logging in with your new password.'
        });
      }
    } catch (error) {
      const { errorData } = error as CustomAxiosError;
      errorToast({
        title: 'Error in resetting password',
        description: errorData.message || errorData.detail[0].msg
      });
    }
  });

  return {
    resetPasswordForm: form,
    showModal,
    toggleModal,
    sendCodeToEmail,
    resetPassword: submit,
    isFormSubmitting: form.formState.isSubmitting,
    isEmailSubmitting,
    isFormValid: form.formState,
    sendCodeDisabled: !!form.formState.errors.email || email.length === 0
  };
};
