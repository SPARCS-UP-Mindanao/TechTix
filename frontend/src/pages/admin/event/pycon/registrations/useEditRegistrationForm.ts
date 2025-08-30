import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { deleteRegistration, updateRegistration } from '@/api/pycon/registrations';
import { CustomAxiosError } from '@/api/utils/createApi';
import { Registration, mapRegistrationToFormValues, mapUpdateRegistrationValues } from '@/model/pycon/registrations';
import { isValidContactNumber } from '@/utils/functions';
import useAdminEvent from '@/hooks/useAdminEvent';
import { useApi } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { zodResolver } from '@hookform/resolvers/zod';

const EditRegistrationFormSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address'
  }),
  firstName: z.string().min(1, {
    message: 'Please enter your first name'
  }),
  lastName: z.string().min(1, {
    message: 'Please enter your last name'
  }),
  nickname: z.string().min(1, {
    message: 'Please enter your nickname'
  }),
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
  facebookLink: z.string().min(1, {
    message: 'Please enter your facebook profile link'
  }),
  linkedInLink: z.string().optional(),
  ticketType: z.string().min(1, {
    error: 'Please select a ticket'
  }),
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
  discountCode: z.string().optional()
});

export type EditRegistrationFormValues = z.infer<typeof EditRegistrationFormSchema>;

export const useEditRegistrationForm = (eventId: string, registrationInfo: Registration) => {
  const api = useApi();
  const eventContext = useAdminEvent();
  const { errorToast, successToast } = useNotifyToast();

  const registrationId = registrationInfo.registrationId;

  const form = useForm<EditRegistrationFormValues>({
    mode: 'onChange',
    resolver: zodResolver(EditRegistrationFormSchema),
    defaultValues: mapRegistrationToFormValues(registrationInfo)
  });

  const onUpdate = form.handleSubmit(async (values) => {
    try {
      const response = await api.execute(updateRegistration(eventId, registrationId, mapUpdateRegistrationValues(values)));
      if (response.status === 200) {
        successToast({
          title: 'Updated successfully',
          description: 'Registration updated successfully'
        });
        eventContext?.refetchEvent();
      } else {
        const {
          errorData: { message }
        } = response;
        errorToast({
          title: 'Error in updating registration',
          description: message || 'An error occurred while updating registration. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in updating registration',
        description: errorData?.message || 'An error occurred while updating registration. Please try again.'
      });
    }
  });

  const onDelete = form.handleSubmit(async () => {
    try {
      const response = await api.execute(deleteRegistration(eventId, registrationId));

      if (response.status === 200 || response.status === 204) {
        successToast({
          title: 'Deleted successfully',
          description: 'Registration deleted successfully'
        });
        eventContext?.refetchEvent();
      } else {
        const {
          errorData: { message }
        } = response;
        errorToast({
          title: 'Error in deleting registration',
          description: message || 'An error occurred while deleting registration. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in deleting registration',
        description: errorData?.message || 'An error occurred while deleting registration. Please try again.'
      });
    }
  });

  return {
    form,
    onUpdate,
    onDelete
  };
};
