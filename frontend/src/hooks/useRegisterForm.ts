import { useSearchParams } from 'react-router-dom';
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
  cityOfResidence: z.string().min(1, {
    message: 'Please enter your city of residence'
  }),
  discountCode: z.string().optional(),
  discountPercentage: z.number().optional(),
  transactionFee: z.number().optional().nullish(),
  paymentMethod: z.custom<PaymentMethod | null>().optional(),
  paymentChannel: z.custom<PaymentChannel | null>().optional(),
  discountedPrice: z.number().optional(),
  total: z.number().optional(),
  foodRestrictions: z.string().optional(),

  ticketTypeId: z.string().optional(),
  shirtSize: z.string().optional(),
  industry: z.string().optional(),
  levelOfAWSUsage: z.string().optional(),
  awsUsecase: z.string().optional(),
  awsCommunityDayInLineWith: z.string().optional(),
  transactionId: z.string().optional()
});

const RegisterFormSchemaAWS = RegisterFormSchema.extend({
  ticketTypeId: z.string().min(1, {
    message: 'Please select a ticket type'
  }),
  shirtSize: z.string().min(1, {
    message: 'Please select your shirt size'
  }),
  industry: z.string().min(1, {
    message: 'Please select your industry'
  }),
  levelOfAWSUsage: z.string().min(1, {
    message: 'Please select your level of AWS usage'
  }),
  awsUsecase: z.string().min(1, {
    message: 'Please enter your AWS usecase'
  }),
  awsCommunityDayInLineWith: z.string().min(1, {
    message: 'Please enter your AWS community day in line with'
  })
});

export type PreRegisterFormValues = z.infer<typeof PreRegisterFormSchema>;
export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
export type RegisterFormValuesAWS = z.infer<typeof RegisterFormSchemaAWS>;

export type RegisterField = keyof RegisterFormValues;
export type RegisterFieldAWS = keyof RegisterFormValuesAWS;

type RegisterFieldMap = Partial<Record<RegisterStepId, RegisterField[]>>;
type RegisterFieldMapAWS = Partial<Record<RegisterStepId, RegisterFieldAWS[]>>;

export const REGISTER_FIELDS: RegisterFieldMap = {
  UserBio: ['firstName', 'lastName', 'email', 'contactNumber', 'cityOfResidence'],
  PersonalInfo: ['careerStatus', 'organization', 'title', 'yearsOfExperience']
};

export const REGISTER_FIELDS_WITH_PREREGISTRATION: RegisterFieldMap = {
  ...REGISTER_FIELDS,
  EventDetails: ['email']
};

export const REGISTER_FIELDS_WITH_TICKET_TYPE_AWS: RegisterFieldMapAWS = {
  ...REGISTER_FIELDS,
  UserBio: [...(REGISTER_FIELDS.UserBio || []), 'foodRestrictions'],
  PersonalInfo: [...(REGISTER_FIELDS.PersonalInfo || []), 'shirtSize', 'industry', 'levelOfAWSUsage', 'awsUsecase', 'awsCommunityDayInLineWith', 'ticketTypeId']
};

const getFormSchema = (mode: RegisterMode, isConference: boolean) => {
  if (mode === 'preregister') {
    return PreRegisterFormSchema;
  }

  return isConference ? RegisterFormSchemaAWS : RegisterFormSchema;
};

export const useRegisterForm = (eventId: string, mode: RegisterMode, navigateOnSuccess: () => void, isConference: boolean = false) => {
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();
  const [searchParams] = useSearchParams();
  const transactionIdFromUrl = searchParams.get('transactionId');

  const form = useForm<RegisterFormValues | RegisterFormValuesAWS>({
    mode: 'onChange',
    resolver: zodResolver(getFormSchema(mode, isConference)),
    defaultValues: async () => {
      if (mode === 'preregister') {
        return {
          firstName: '',
          lastName: '',
          contactNumber: '',
          careerStatus: '',
          yearsOfExperience: '',
          organization: '',
          title: '',
          shirtSize: '',
          ticketTypeId: ''
        };
      }

      const savedState = localStorage.getItem('formState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return {
          ...parsedState,
          transactionId: transactionIdFromUrl || parsedState.transactionId
        };
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
        total: 0,
        ticketTypeId: '',
        shirtSize: '',
        industry: '',
        levelOfAWSUsage: '',
        awsUsecase: '',
        awsCommunityDayInLineWith: '',
        transactionId: transactionIdFromUrl || ''
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
