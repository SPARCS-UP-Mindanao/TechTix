import Button from "@/components/Button";
import {
  FormDescription,
  FormItem,
  FormLabel,
  FormError,
} from "@/components/Form";
import Input from "@/components/Input";
import { useAdminLoginForm } from "@/hooks/useAdminLoginForm";
import { FormProvider } from "react-hook-form";

const LoginForm = () => {
  const { form, submit } = useAdminLoginForm();

  return (
    <div>
      <h1>Register</h1>
      <FormProvider {...form}>
        <FormItem name="email">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel>Email</FormLabel>
              <Input type="email" {...field} />
              <FormDescription className="font-subjectivity">
                Whereas recognition of the inherent dignity
              </FormDescription>
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="age">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel optional>Age</FormLabel>
              <Input type="text" placeholder="Enter your age" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="password">
          {({ field }) => (
            <div className="flex flex-col items-start mb-5 space-y-2">
              <FormLabel toolTipContent={"Enter atleast 8 characters"}>
                Password
              </FormLabel>
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
