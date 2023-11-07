import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateEvent, createEvent, getEvent } from '@/api/events';
import { CustomAxiosError } from '@/api/utils/createApi';
import { isEmpty } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
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
  price: z.coerce.number().min(0, {
    message: 'Please enter the event price'
  }),
  status: z.string().min(1, {
    message: 'Please enter the event status'
  })
});

export type EventFormValues = z.infer<typeof EventFormSchema>;

interface EventFormProps {
  eventId?: string;
  refetch?: () => void;
}

export const useEventForm = ({ eventId, refetch }: EventFormProps) => {
  const { successToast, errorToast } = useNotifyToast();

  const form = useForm<EventFormValues>({
    mode: 'onChange',
    resolver: zodResolver(EventFormSchema),
    defaultValues: async () => {
      if (eventId) {
        const { queryFn: event } = getEvent(eventId);
        const response = await event();
        const eventResponse = response.data;
        return eventResponse;
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
    const { queryFn: event } = eventId ? updateEvent(eventId, values) : createEvent(values);

    try {
      if (!isEmpty(form.formState.errors)) {
        throw new Error('Please fill in all the required fields');
      }

      const response = await event();
      if (response.status === 200) {
        successToast({
          title: 'Event Info',
          description: `Event Updated Successfully`
        });
        form.reset();
        refetch && refetch();
      } else {
        errorToast({
          title: 'Error in Event',
          description: 'An error occurred while submitting. Please try again.'
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
