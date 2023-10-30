import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNotifyToast } from "@/hooks/useNotifyToast";
import { useApi } from "./useApi";
import { registerUser } from "@/api/auth";

const RegisterFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  // .refine((val) => val !== "test@gmail.com", { message: "Errrorrrr" })
  password: z.string().min(8, {
    message: "Please enter atleast 8 characters",
  }),
});

export const useRegisterForm = () => {
  const { successToast, errorToast } = useNotifyToast();
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { email, password } = form.getValues();
  const { data: response } = useApi(registerUser(email, password), {
    active: form.formState.isSubmitting,
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      if (response) {
        successToast({
          title: "Register Info",
          description: `Registering user with email: ${values.email}`,
        });
      }
    } catch {
      errorToast({
        title: "Error in Registering",
        description: JSON.stringify(response || form.formState.errors),
      });
    }
  });

  return {
    form,
    submit,
  };
};
