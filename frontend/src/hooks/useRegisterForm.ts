import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNotifyToast } from "./useNotifyToast";

const isValidContactNumber = (value: string) => {
  const phoneNumberPattern = /^\d{11}$/;
  return phoneNumberPattern.test(value);
};

export const RegisterFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),

  firstName: z.string().min(1, {
    message: "Please enter your first name",
  }),
  lastName: z.string().min(1, {
    message: "Please enter your last name",
  }),
  contactNumber: z.string().refine(
    isValidContactNumber, 
    {
    message: "Please enter your contact number",
  }),
  status: z.string().min(1, {
    message: "Please enter your current status"
  }),
  yearsOfExperience: z.string().min(1, {
    message: "Please enter years of experience"
  }),
  organization: z.string().optional(),
  title: z.string().optional(),
  })
  // description: z.string().min(4, {
  //   message: "Please enter description",
  // }),
  // date: z.date().min(new Date(2023, 0, 1), {
  //   message: "Select Date",
  // }),
  // venue: z.string().min(4, {
  //   message: "Please enter venue",
  // }),
  // eventBanner: z.string().refine((value) => {
  //   return /\.(jpg|jpeg|png|gif|bmp)$/i.test(value);
  // }, {
  //   message: "Please enter a valid image file (jpg, jpeg, png, gif, bmp)",
  // }),
  // eventLogo: z.string().refine((value) => {
  //   return /\.(jpg|jpeg|png|gif|bmp)$/i.test(value);
  // }, {
  //   message: "Please enter a valid image file (jpg, jpeg, png, gif, bmp)",
  // }),

export const useRegisterForm = () => {
  const { successToast, errorToast } = useNotifyToast();

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      contactNumber: "",
      status: "",
      yearsOfExperience: "",
      organization: "",
      title: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      successToast({
        title: "Register Info",
        description: `Registering user with email: ${values.email}`,
      });
    } catch (error) {
      errorToast({
        title: "Error in Registering",
        description: JSON.stringify(form.formState.errors),
      });
    }
  });

  return {
    form,
    submit,
  };
};
