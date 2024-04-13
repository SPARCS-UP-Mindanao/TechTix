import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { preRegisterUserInEvent } from '@/api/preregistrations';
import { registerUserInEvent } from '@/api/registrations';
import { CustomAxiosError } from '@/api/utils/createApi';
import { PaymentChannel, PaymentMethod } from '@/model/payments';
import { mapCreatePreregistrationValues } from '@/model/preregistrations';
import { RegisterMode, mapCreateRegistrationValues } from '@/model/registrations';
import { isValidContactNumber } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterStepId } from '@/pages/client/register/steps/RegistrationSteps';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

const PreRegisterFormSchema = z.object({
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
  })
});

const RegisterFormSchema = PreRegisterFormSchema.extend({
  discountCode: z.string().optional(),
  discountPercentage: z.number().optional(),
  transactionFee: z.number().optional().nullish(),
  paymentMethod: z.custom<PaymentMethod | null>().optional(),
  paymentChannel: z.custom<PaymentChannel | null>().optional(),
  discountedPrice: z.number().optional(),
  total: z.number().optional()
});

export type PreRegisterFormValues = z.infer<typeof PreRegisterFormSchema>;
export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

export type RegisterField = keyof RegisterFormValues;

type RegisterFieldMap = Partial<Record<RegisterStepId, RegisterField[]>>;

export const REGISTER_FIELDS: RegisterFieldMap = {
  UserBio: ['firstName', 'lastName', 'email', 'contactNumber'],
  PersonalInfo: ['careerStatus', 'organization', 'title', 'yearsOfExperience']
};

export const REGISTER_FIELDS_WITH_PREREGISTRATION: RegisterFieldMap = {
  ...REGISTER_FIELDS,
  EventDetails: ['email']
};

const getFormSchema = (mode: RegisterMode) => {
  if (mode === 'preregister') {
    return PreRegisterFormSchema;
  }

  return RegisterFormSchema;
};

export const useRegisterForm = (eventId: string, mode: RegisterMode, navigateOnSuccess: () => void) => {
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();
  const form = useForm<RegisterFormValues>({
    mode: 'onChange',
    resolver: zodResolver(getFormSchema(mode)),
    defaultValues: async () => {
      if (mode === 'preregister') {
        return {
          firstName: '',
          lastName: '',
          contactNumber: '',
          careerStatus: '',
          yearsOfExperience: '',
          organization: '',
          title: ''
        };
      }

      const savedState = localStorage.getItem('formState');
      if (savedState) {
        const formState = JSON.parse(savedState);
        return formState;
      }

      return {
        email: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        careerStatus: '',
        yearsOfExperience: '',
        organization: '',
        title: '',
        discountCode: '',
        discountPercentage: 0,
        transactionFee: null,
        paymentMethod: null,
        paymentChannel: null,
        discountedPrice: 0,
        total: 0
      };
    }
  });

  const registerUser = form.handleSubmit(async (values) => {
    try {
      const response = await api.execute(registerUserInEvent(mapCreateRegistrationValues(values, eventId)));
      if (response.status === 200) {
        successToast({
          title: 'Registration Successful',
          description: `Successfully registered user with email: ${values.email}`
        });
        navigateOnSuccess();
      } else if (response.status === 400) {
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
        title: 'Error in Registering',
        description: errorData.message || errorData.detail[0].msg || 'An error occurred while registering. Please try again.'
      });
    }
  });

  const preRegisterUser = form.handleSubmit(async (values) => {
    try {
      const response = await api.execute(preRegisterUserInEvent(mapCreatePreregistrationValues(values, eventId)));
      if (response.status === 200) {
        successToast({
          title: 'Pregistration Successful',
          description: `Successfully pre-registered user with email: ${values.email}`
        });
      } else if (response.status === 400) {
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
          title: 'Error in Pre-registering',
          description: 'An error occurred while pre-registering. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in Pre-registering',
        description: errorData.message || errorData.detail[0].msg || 'An error occurred while pre-registering. Please try again.'
      });
    }
  });

  return {
    form,
    onSubmit: mode === 'preregister' ? preRegisterUser : registerUser
  };
};
