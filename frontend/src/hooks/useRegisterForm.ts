import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerUserInEvent } from '@/api/registrations';
import { CustomAxiosError } from '@/api/utils/createApi';
import { isValidContactNumber } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

const RegisterFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  firstName: z.string().min(1, {
    message: 'Please enter your first name'
  }),
  lastName: z.string().min(1, {
    message: 'Please enter your last name'
  }),
  contactNumber: z
    .string()
    .min(1, {
      message: 'Please enter your contact number'
    })
    .refine(isValidContactNumber, {
      message: 'Please enter a valid PH contact number'
    }),
  careerStatus: z.string().min(1, {
    message: 'Please select your career status'
  }),
  yearsOfExperience: z.string().min(1, {
    message: 'Please select your years of experience'
  }),
  organization: z.string().min(1, {
    message: 'Please enter your organization'
  }),
  title: z.string().min(1, {
    message: 'Please enter your title'
  }),
  gcashPayment: z
    .string()
    .min(1, {
      message: 'Please submit a screenshot of your Gcash payment'
    })
    .nullish(),
  referenceNumber: z
    .string()
    .min(1, {
      message: 'Please enter your Gcash reference number'
    })
    .refine((value) => value.length === 13, {
      message: 'Please enter a valid Gcash reference number'
    })
    .nullish(),
  discountCode: z.string().optional(),
  amountPaid: z
    .number()
    .min(0, {
      message: 'Please enter a valid amount'
    })
    .nullish()
});

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

export const useRegisterForm = (entryId: string, navigateOnSuccess: () => void) => {
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();
  const form = useForm<RegisterFormValues>({
    mode: 'onChange',
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
      careerStatus: '',
      yearsOfExperience: '',
      organization: '',
      title: ''
    }
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      const response = await api.execute(
        registerUserInEvent({
          eventId: entryId,
          certificateClaimed: false,
          ...values
        })
      );
      if (response.status === 200) {
        successToast({
          title: 'Register Info',
          description: `Registering user with email: ${values.email}`
        });
        navigateOnSuccess();
      } else if (response.status === 400) {
        console.log(response);
        const { message } = response.errorData;
        errorToast({
          title: message
        });
      } else if (response.status === 409) {
        form.setError('email', {
          type: 'manual',
          message: 'The email you entered has already been used. Please enter a different email.'
        });
        errorToast({
          title: 'Email already registered',
          description: 'The email you entered has already been used. Please enter a different email.'
        });
      } else {
        errorToast({
          title: 'Error in Registering',
          description: 'An error occurred while registering. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in logging in',
        description: errorData.message || errorData.detail[0].msg
      });
    }
  });

  return {
    form,
    submit
  };
};
