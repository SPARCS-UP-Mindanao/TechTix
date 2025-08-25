import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerUserInEvent } from '@/api/pycon/registrations';
import { CustomAxiosError } from '@/api/utils/createApi';
import { PaymentChannel, PaymentMethod } from '@/model/payments';
import { mapCreateRegistrationValues } from '@/model/pycon/registrations';
import { isValidContactNumber } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterStepId } from '../register/steps/RegistrationSteps';
import { zodResolver } from '@hookform/resolvers/zod';

const RegisterFormSchema = z
  .object({
    email: z.email({
      message: 'Please enter a valid email address'
    }),
    firstName: z.string().min(1, {
      message: 'Please enter your first name'
    }),
    lastName: z.string().min(1, {
      message: 'Please enter your last name'
    }),
    nickname: z.string().optional(),
    pronouns: z.string().min(1, {
      message: 'Please enter your pronouns'
    }),
    contactNumber: z
      .string()
      .min(1, {
        message: 'Please enter your contact number'
      })
      .refine(isValidContactNumber, {
        message: 'Please enter a valid PH contact number'
      }),
    organization: z.string().min(1, {
      message: 'Please enter your organization'
    }),
    jobTitle: z.string().min(1, {
      message: 'Please select your title'
    }),
    facebookLink: z.string().optional(),
    linkedInLink: z.string().optional(),
    ticketType: z.string(),
    sprintDay: z.boolean(),
    availTShirt: z.boolean(),
    shirtType: z.string().optional(),
    shirtSize: z.string().optional(),
    communityInvolvement: z.boolean(),
    futureVolunteer: z.boolean(),
    dietaryRestrictions: z.string().optional(),
    accessibilityNeeds: z.string().optional(),
    validIdObjectKey: z.string().min(1, {
      message: 'Please upload your valid ID'
    }),
    amountPaid: z.number(),
    transactionId: z.string(),
    discountCode: z.string().optional(),
    // ----- //
    paymentMethod: z.custom<PaymentMethod | null>(),
    paymentChannel: z.custom<PaymentChannel | null>(),
    discountPercentage: z.number().optional(),
    transactionFee: z.number().optional().nullish(),
    discountedPrice: z.number().optional(),
    total: z.number()
  })
  .refine(
    (data) => {
      if (data.availTShirt && (!data.shirtType || data.shirtSize)) {
        return false;
      }

      return true;
    },
    {
      error: 'Please select your shirt type and size',
      path: ['shirtType', 'shirtSize']
    }
  );

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
export type RegisterField = keyof RegisterFormValues;
type RegisterFieldMap = Record<RegisterStepId, RegisterField[]>;

export const REGISTER_FIELDS: RegisterFieldMap = {
  EventDetails: [],
  BasicInfo: ['firstName', 'lastName', 'nickname', 'email', 'contactNumber', 'pronouns', 'organization', 'jobTitle'],
  TicketSelection: ['ticketType', 'sprintDay', 'shirtSize', 'shirtType'],
  Miscellaneous: ['communityInvolvement', 'futureVolunteer', 'dietaryRestrictions', 'accessibilityNeeds'],
  'Payment&Verification': ['paymentMethod', 'paymentChannel', 'discountCode', 'discountedPrice', 'transactionFee', 'total', 'validIdObjectKey'],
  Summary: [],
  Success: []
} as const;

export const useRegisterForm = (eventId: string, navigateOnSuccess: () => void) => {
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();
  const [searchParams] = useSearchParams();
  const transactionIdFromUrl = searchParams.get('paymentTransactionId');

  const form = useForm<RegisterFormValues>({
    mode: 'onChange',
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: async () => {
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
        pronouns: '',
        contactNumber: '',
        organization: '',
        jobTitle: '',
        facebookLink: '',
        linkedInLink: '',
        ticketType: '',
        sprintDay: false,
        availTShirt: false,
        shirtType: '',
        shirtSize: '',
        communityInvolvement: false,
        futureVolunteer: false,
        dietaryRestrictions: '',
        accessibilityNeeds: '',
        validIdObjectKey: '',
        amountPaid: 0,
        discountCode: '',
        // ----- //
        transactionId: '',
        paymentMethod: '',
        paymentChannel: '',
        discountPercentage: '',
        transactionFee: '',
        discountedPrice: 0,
        total: 0
      };
    }
  });

  console.log({ values: form.watch(), errors: form.formState.errors });

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

  return {
    form,
    onSubmit: registerUser
  };
};
