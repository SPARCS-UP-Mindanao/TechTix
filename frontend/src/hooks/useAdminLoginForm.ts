import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNotifyToast } from "./useNotifyToast";
import { useApi } from "@/hooks/useApi";
import { loginUser } from "@/api/auth";

const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Please enter atleast 8 characters",
  }),
});

export const useAdminLoginForm = () => {
  const { successToast, errorToast } = useNotifyToast();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { email, password } = form.getValues();
  const { data: loginResponse } = useApi(loginUser(email, password), {
    active: form.formState.isSubmitting,
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      if (loginResponse) {
        successToast({
          title: "Login Info",
          description: `Logged in user with email: ${values.email}`,
        });
      }
    } catch (error) {
      errorToast({
        title: "Error in logging in",
        description: JSON.stringify(form.formState.errors),
      });
    }
  });

  return {
    form,
    submit,
  };
};
