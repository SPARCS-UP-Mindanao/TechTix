import Button from "@/components/Button";
import { FormItem, FormLabel, FormError } from "@/components/Form";
import Input from "@/components/Input";
import { useAdminLoginForm } from "@/hooks/useAdminLoginForm";
import { useIsAuthenticated } from "react-auth-kit";
import { FormProvider } from "react-hook-form";
import { Navigate } from "react-router-dom";

const LoginForm = () => {
  const { form, submit } = useAdminLoginForm();
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated()) {
    return <Navigate to="/admin/events" />;
  }

  return (
    <div>
      <h1>Admin login</h1>
      <FormProvider {...form}>
        <FormItem name="email">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel>Email</FormLabel>
              <Input type="email" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="password">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel>Password</FormLabel>
              <Input type="password" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <Button onClick={submit}>Submit</Button>
      </FormProvider>
    </div>
  );
};

export default LoginForm;
