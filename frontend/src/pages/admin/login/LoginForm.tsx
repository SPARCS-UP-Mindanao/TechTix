import { Navigate } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { useAdminLoginForm } from '@/hooks/useAdminLoginForm';

const LoginForm = () => {
  const { form, submit } = useAdminLoginForm();
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated()) {
    return <Navigate to="/admin/events" />;
  }

  return (
    <section className="flex flex-col space-y-4 w-full max-w-2xl">
      <h1 className="text-center">Admin login</h1>

      <FormProvider {...form}>
        <FormItem name="email">
          {({ field }) => (
            <div className="space-y-2">
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
              <Input type="password" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <div className="w-full flex justify-center">
          <Button onClick={submit} className="w-full min-w-min max-w-[40%]">
            Submit
          </Button>
        </div>
      </FormProvider>
    </section>
  );
};

export default LoginForm;
