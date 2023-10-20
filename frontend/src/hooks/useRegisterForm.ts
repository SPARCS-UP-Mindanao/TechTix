import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNotifyToast } from "./useNotifyToast";

const RegisterFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Please enter atleast 8 characters",
  }),
});

export const useRegisterForm = () => {
  const { infoToast } = useNotifyToast();

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    infoToast({
      title: "Register Info",
      description: `Registering user with email: ${values.email}`,
      icon: "Success",
    });
  });

  return {
    form,
    handleSubmit,
  };
};
