import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateEvent, createEvent, getEvent } from '@/api/events';
import { CustomAxiosError } from '@/api/utils/createApi';
import { isEmpty } from '@/utils/functions';
import { isValidContactNumber } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

export const EventFormSchema = z.object({
  name: z.string().min(1, {
    message: 'Please enter the event name'
  }),
  description: z.string().min(1, {
    message: 'Please enter the event description'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  startDate: z.string().min(1, {
    message: 'Please enter the event date'
  }),
  endDate: z.string().min(1, {
    message: 'Please enter the event date'
  }),
  venue: z.string().min(1, {
    message: 'Please enter the event venue'
  }),
  payedEvent: z.boolean(),
  price: z.coerce.number().min(0, {
    message: 'Please enter the event price'
  }),
  status: z.enum(['draft', 'open', 'cancelled', 'closed', 'completed']),
  bannerLink: z.string().nullish(),
  logoLink: z.string().nullish(),
  certificateTemplate: z.string().nullish(),
  gcashQRCode: z.string().nullish(),
  gcashName: z.string().nullish(),
  gcashNumber: z
    .string()
    .refine(isValidContactNumber, {
      message: 'Please enter a valid PH contact number'
    })
    .nullish()
});

export type EventFormValues = z.infer<typeof EventFormSchema>;

interface EventFormProps {
  eventId?: string;
  refetch?: () => void;
  setCreateEventOpen?: (value: boolean) => void;
}

export const useAdminEventForm = ({ eventId, refetch, setCreateEventOpen }: EventFormProps) => {
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();
  const form = useForm<EventFormValues>({
    mode: 'onChange',
    resolver: zodResolver(EventFormSchema),
    defaultValues: async () => {
      if (eventId) {
        const { queryFn: event } = getEvent(eventId);
        const response = await event();
        const { data } = response;
        return data;
      }

      return {
        name: '',
        description: '',
        email: '',
        startDate: '',
        endDate: '',
        venue: '',
        autoConfirm: false,
        payedEvent: false,
        price: 0,
        status: 'draft'
      };
    }
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      if (!isEmpty(form.formState.errors)) {
        throw new Error('Please fill in all the required fields');
      }

      const response = await (eventId ? api.execute(updateEvent(eventId, values)) : api.execute(createEvent(values)));

      if (response.status === 200) {
        const successTitle = eventId ? 'Event updated' : 'Event created';
        const successMessage = eventId ? 'Event updated successfully' : 'Event created successfully';
        successToast({
          title: successTitle,
          description: successMessage
        });

        form.reset();
        refetch && refetch();

        // Fetch the event details after successful submission
        if (eventId) {
          const { queryFn: getEventDetails } = getEvent(eventId);
          const { data: eventData } = await getEventDetails();

          // Set the form values with the fetched event data
          Object.keys(eventData).forEach((key) => {
            const eventKey = key as keyof EventFormValues;
            if (eventData[eventKey] !== undefined) {
              form.setValue(eventKey, eventData[eventKey]);
            }
          });
        } else if (setCreateEventOpen) {
          setCreateEventOpen(false);
        }
      } else {
        const toastMessage = eventId ? 'Error in updating an event' : 'Error in creating an event';
        errorToast({
          title: toastMessage,
          description: response.errorData.message || 'An error occurred while submitting. Please try again.'
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
