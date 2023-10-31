import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNotifyToast } from "@/hooks/useNotifyToast";
import { useFetchQuery } from "./useApi";
import { registerUserInEvent } from "@/api/registrations";

const isValidContactNumber = (value: string) => {
  const phoneNumberPattern = /^\d{11}$/;
  return phoneNumberPattern.test(value);
};

const isValidEmail = (value: string) => {
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailPattern.test(value);
};

export const RegisterFormSchema = z.object({
  email: z.string().refine(isValidEmail, {
    message: "Please enter a valid email address",
  }),

  firstName: z.string().min(1, {
    message: "Please enter your first name",
  }),
  lastName: z.string().min(1, {
    message: "Please enter your last name",
  }),
  contactNumber: z.string().refine(isValidContactNumber, {
    message: "Please enter a valid contact number",
  }),
  careerStatus: z.string().min(1, {
    message: "Please enter your current status",
  }),
  yearsOfExperience: z.string().min(1, {
    message: "Please enter years of experience",
  }),
  organization: z.string().optional(),
  title: z.string().optional(),
});

export const useRegisterForm = (entryId: string) => {
  const { successToast, errorToast } = useNotifyToast();
  const { fetchQuery } = useFetchQuery();
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      careerStatus: "",
      yearsOfExperience: "",
      organization: "",
      title: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      const response = await fetchQuery(registerUserInEvent({
        eventId: entryId,
        certificateClaimed: false,
        ...values,
      }));
      if (response) {
        successToast({
          title: "Register Info",
          description: `Registering user with email: ${values.email}`,
        });
      }
    } catch (error) {
      errorToast({
        title: "Error in Registering",
        description: JSON.stringify(error || form.formState.errors),
      });
    }
  });

  return {
    form,
    submit,
  };
};