import { KeyboardEvent, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { useAdminLoginForm } from '@/hooks/useAdminLoginForm';
import { useForgetPassword } from '@/hooks/useForgetPassword';

export type ResetModalSteps = 'email' | 'submit';

const ResetPasswordModal = () => {
  const [step, setStep] = useState<ResetModalSteps>('email');
  const { resetPasswordForm, sendCodeToEmail, resetPassword, showModal, toggleModal, isEmailSubmitting, isFormSubmitting, isFormValid, sendCodeDisabled } =
    useForgetPassword(setStep);

  const ModalFooter = () => {
    return (
      <div className="flex justify-end gap-4">
        {step === 'email' && (
          <Button onClick={async () => await sendCodeToEmail()} disabled={sendCodeDisabled} loading={isEmailSubmitting}>
            Send code
          </Button>
        )}
        {step === 'submit' && (
          <>
            <Button variant="ghost" onClick={() => setStep('email')}>
              Back
            </Button>
            <Button onClick={resetPassword} disabled={!isFormValid} loading={isFormSubmitting}>
              Reset Password
            </Button>
          </>
        )}
      </div>
    );
  };

  const getModalDescription = () => {
    if (step === 'email') {
      return 'Enter your email and we will send you a code to reset your password.';
    }
    if (step === 'submit') {
      return 'Enter the code sent to your email and your new password.';
    }
  };

  return (
    <Modal
      modalTitle="Reset Password"
      modalDescription={getModalDescription()}
      visible={showModal}
      showCloseButton={step === 'email'}
      onOpenChange={toggleModal}
      modalFooter={ModalFooter()}
      trigger={
        <Button variant="link" className="text-foreground p-0">
          Forgot Password?
        </Button>
      }
    >
      <FormProvider {...resetPasswordForm}>
        <main>
          {step === 'email' && (
            <FormItem name="email">
              {({ field }) => (
                <div className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
          )}
          {step === 'submit' && (
            <>
              <FormItem name="confirmationCode">
                {({ field }) => (
                  <div className="space-y-2">
                    <FormLabel>Confirmation code</FormLabel>
                    <Input type="text" {...field} />
                    <FormError />
                  </div>
                )}
              </FormItem>
              <FormItem name="password">
                {({ field }) => (
                  <div className="space-y-2">
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...field} />
                    <FormError />
                  </div>
                )}
              </FormItem>
              <FormItem name="confirmPassword">
                {({ field }) => (
                  <div className="space-y-2">
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type="password" {...field} />
                    <FormError />
                  </div>
                )}
              </FormItem>
            </>
          )}
        </main>
      </FormProvider>
    </Modal>
  );
};

const LoginForm = () => {
  const { form, submit, isSubmitting } = useAdminLoginForm();
  const [showPassword, setShowPassword] = useState(false);
  const onEnterKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      submit();
    }
  };

  const onShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <FormProvider {...form}>
      <form onKeyDown={onEnterKey}>
        <div className="space-y-8">
          <FormItem name="email">
            {({ field }) => (
              <div className="space-y-4">
                <FormLabel>Email</FormLabel>
                <Input type="email" {...field} />
                <FormError />
              </div>
            )}
          </FormItem>

          <FormItem name="password">
            {({ field }) => (
              <div className="flex flex-col items-start space-y-2">
                <FormLabel>Password</FormLabel>
                <div className="w-full inline-flex items-center">
                  <Input type={showPassword ? 'text' : 'password'} {...field} className="pr-8" />
                  <Icon
                    name={showPassword ? 'EyeOff' : 'Eye'}
                    className="-ml-8 cursor-pointer hover:text-muted-foreground transition-colors"
                    onClick={onShowPassword}
                  />
                </div>
                <FormError />
              </div>
            )}
          </FormItem>
        </div>

        <div className="flex justify-between">
          <ResetPasswordModal />
          <Button onClick={submit} className="w-full min-w-min max-w-[20%]" loading={isSubmitting}>
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
