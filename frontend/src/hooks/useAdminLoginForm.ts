import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNotifyToast } from "./useNotifyToast";
import { useFetchQuery } from "@/hooks/useApi";
import { loginUser } from "@/api/auth";
import { useSignIn } from "react-auth-kit";
import { signInFunctionParams } from "react-auth-kit/dist/types";
import { setCookie } from "typescript-cookie";

const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Please enter atleast 8 characters",
  }),
});

export const useAdminLoginForm = () => {
  const { errorToast } = useNotifyToast();
  const { fetchQuery } = useFetchQuery<signInFunctionParams>();
  const signIn = useSignIn();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = form.handleSubmit(async ({ email, password }) => {
    try {
      const response = await fetchQuery(loginUser(email, password));
      setCookie("_auth_user", response.authState?.userId, { expires: 30 });
      console.log(response);

      signIn(response);
    } catch (error) {
      console.error(error);
      errorToast({
        title: "Error in logging in",
        description: Object.toString(),
      });
    }
  });

  return {
    form,
    submit,
  };
};
