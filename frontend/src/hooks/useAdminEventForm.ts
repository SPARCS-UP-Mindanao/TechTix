import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateEvent } from '@/api/events';
import { getEvent } from '@/api/events';
import { CustomAxiosError } from '@/api/utils/createApi';
import { convertToDateTimeLocalString } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { zodResolver } from '@hookform/resolvers/zod';

export const EventFormSchema = z.object({
  name: z.string().min(1, {
    message: 'Please enter the event name'
  }),
  description: z.string().min(1, {
    message: 'Please enter the event description'
  }),
  email: z.optional(
    z.string().email({
      message: 'Please enter a valid email address'
    })
  ),
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
  status: z.optional(
    z.string().min(1, {
      message: 'Please enter the event status'
    })
  )
});

export type EventFormValues = z.infer<typeof EventFormSchema>;

export const useEventForm = (eventId: string) => {
  const { successToast, errorToast } = useNotifyToast();
  const form = useForm<EventFormValues>({
    mode: 'onChange',
    resolver: zodResolver(EventFormSchema),
    defaultValues: async () => {
      const { queryFn: event } = getEvent(eventId);
      const response = await event();
      const eventResponse = response.data;
      return {
        name: eventResponse.name,
        description: eventResponse.description,
        email: eventResponse.email,
        startDate: convertToDateTimeLocalString(new Date(eventResponse.startDate)),
        endDate: convertToDateTimeLocalString(new Date(eventResponse.endDate)),
        venue: eventResponse.venue,
        autoConfirm: eventResponse.autoConfirm,
        payedEvent: eventResponse.payedEvent,
        price: eventResponse.price,
        status: eventResponse.status
      };
    }
  });

  const submit = form.handleSubmit(async (values) => {
    const { queryFn: event } = updateEvent(eventId, values);
    try {
      const response = await event();
      if (response.status === 200) {
        successToast({
          title: 'Event Info',
          description: `Event Updated Successfully`
        });
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
