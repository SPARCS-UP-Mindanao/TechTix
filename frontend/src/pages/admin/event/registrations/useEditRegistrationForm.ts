import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updatePreRegistration } from '@/api/preregistrations';
import { deleteRegistration, updateRegistration } from '@/api/registrations';
import { CustomAxiosError } from '@/api/utils/createApi';
import { EventWithRefetchEvent } from '@/model/events';
import { PreRegistration, mapPreRegistrationToFormValues, mapUpdatePreregistrationValues } from '@/model/preregistrations';
import { Registration, mapRegistrationToFormValues, mapUpdateRegistrationValues } from '@/model/registrations';
import { isValidContactNumber } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { zodResolver } from '@hookform/resolvers/zod';

const EditRegistrationFormSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, {
    message: 'Please enter the first name'
  }),
  lastName: z.string().min(1, {
    message: 'Please enter the last name'
  }),
  contactNumber: z
    .string()
    .min(1, {
      message: 'Please enter the contact number'
    })
    .refine(isValidContactNumber, {
      message: 'Please enter a valid PH contact number'
    }),
  careerStatus: z.string().min(1, {
    message: 'Please select the career status'
  }),
  yearsOfExperience: z.string().min(1, {
    message: 'Please select the years of experience'
  }),
  organization: z.string().min(1, {
    message: 'Please enter the organization'
  }),
  title: z.string().min(1, {
    message: 'Please enter the title'
  })
});

export type EditRegistrationFormValues = z.infer<typeof EditRegistrationFormSchema>;

export const useEditRegistrationForm = (eventId: string, registrationInfo: Registration | PreRegistration) => {
  const api = useApi();
  const { refetchEvent } = useOutletContext<EventWithRefetchEvent>();
  const { errorToast, successToast } = useNotifyToast();

  const registrationId = registrationInfo.type === 'registration' ? registrationInfo.registrationId : registrationInfo.preRegistrationId;

  const form = useForm<EditRegistrationFormValues>({
    mode: 'onChange',
    resolver: zodResolver(EditRegistrationFormSchema),
    defaultValues: async () => {
      if (registrationInfo.type === 'registration') {
        return mapRegistrationToFormValues(registrationInfo);
      }

      return mapPreRegistrationToFormValues(registrationInfo);
    }
  });

  // TODO: Fix updating registration, specifically in type mappings

  const onUpdate = form.handleSubmit(async (values) => {
    try {
      const response =
        registrationInfo.type === 'registration'
          ? await api.execute(updateRegistration(eventId, registrationId, mapUpdateRegistrationValues(values, registrationInfo)))
          : await api.execute(updatePreRegistration(eventId, registrationId, mapUpdatePreregistrationValues(values, registrationInfo)));
      if (response.status === 200 || response.status === 200) {
        successToast({
          title: 'Updated successfully',
          description: 'Registration updated successfully'
        });
        refetchEvent();
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
      const response =
        registrationInfo.type === 'registration'
          ? await api.execute(deleteRegistration(eventId, registrationId))
          : await api.execute(deleteRegistration(eventId, registrationId)); // TODO: Follow up for delete pre-registration API
      if (response.status === 200 || response.status === 204) {
        successToast({
          title: 'Deleted successfully',
          description: 'Registration deleted successfully'
        });
        refetchEvent();
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

  const onApprove = form.handleSubmit(async (values) => {
    if (registrationInfo.type !== 'preregistration') {
      return;
    }

    try {
      const response = await api.execute(updatePreRegistration(eventId, registrationId, mapUpdatePreregistrationValues(values, registrationInfo, 'ACCEPTED')));
      if (response.status === 200 || response.status === 204) {
        successToast({
          title: 'Approved successfully',
          description: 'Registration Approved successfully'
        });
        refetchEvent();
      } else {
        const {
          errorData: { message }
        } = response;
        errorToast({
          title: 'Error in approving registration',
          description: message || 'An error occurred while approving registration. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in approving registration',
        description: errorData?.message || 'An error occurred while approving registration. Please try again.'
      });
    }
  });

  const onReject = form.handleSubmit(async (values) => {
    if (registrationInfo.type !== 'preregistration') {
      return;
    }

    try {
      const response = await api.execute(updatePreRegistration(eventId, registrationId, mapUpdatePreregistrationValues(values, registrationInfo, 'REJECTED')));
      if (response.status === 200 || response.status === 204) {
        successToast({
          title: 'Rejected successfully',
          description: 'Registration Rejected successfully'
        });
        refetchEvent();
      } else {
        const {
          errorData: { message }
        } = response;
        errorToast({
          title: 'Error in rejecting registration',
          description: message || 'An error occurred while rejecting registration. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in rejecting registration',
        description: errorData?.message || 'An error occurred while rejecting registration. Please try again.'
      });
    }
  });

  return {
    form,
    onUpdate,
    onDelete,
    onApprove,
    onReject
  };
};
