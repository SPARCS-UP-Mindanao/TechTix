import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createEvent } from '@/api/events';
import { getEvent } from '@/api/events';
import { CustomAxiosError } from '@/api/utils/createApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { Event } from '@/model/events';
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
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  venue: z.string().min(1, {
    message: 'Please enter the event venue'
  }),
  autoConfirm: z.boolean(),
  payedEvent: z.boolean(),
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
      const eventResponse = response.data as Event;
      return {
        name: eventResponse.name,
        description: eventResponse.description,
        email: eventResponse.email,
        startDate: eventResponse.startDate,
        endDate: eventResponse.endDate,
        venue: eventResponse.venue,
        autoConfirm: eventResponse.autoConfirm,
        payedEvent: eventResponse.payedEvent,
        price: eventResponse.price,
        status: eventResponse.status
      };
    }
  });

  const submit = form.handleSubmit(async (values) => {
    const { queryFn: event } = createEvent(values);
    try {
      const response = await event();
      if (response.status === 200) {
        successToast({
          title: 'Event Info',
          description: `Event Created Successfully`
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
