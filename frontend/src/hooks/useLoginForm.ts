import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNotifyToast } from "@/hooks/useNotifyToast";

const LoginFormSchema = z.object({
  email: z
    .string()
    .email()
    .refine((val) => val !== "test@gmail.com", { message: "Errrorrrr" }),
  password: z.string().min(8, {
    message: "Please enter atleast 8 characters",
  }),
});

export const useRegisterForm = () => {
  const { successToast, errorToast } = useNotifyToast();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      successToast({
        title: "Login Info",
        description: `Logging in user with email: ${values.email}`,
      });
    } catch (error) {
      errorToast({
        title: "Error in Logging in",
        description: JSON.stringify(form.formState.errors),
      });
    }
  });

  return {
    form,
    submit,
  };
};
