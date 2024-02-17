import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateEvent, createEvent } from '@/api/events';
import { CustomAxiosError } from '@/api/utils/createApi';
import { Event, EventStatus } from '@/model/events';
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
  paidEvent: z.boolean(),
  price: z.coerce.number().min(0, {
    message: 'Please enter the event price'
  }),
  status: z.custom<EventStatus>().refine((value) => !isEmpty(value), {
    message: 'Please select the event status'
  }),
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
    .nullish(),
  isLimitedSlot: z.boolean().nullish(),
  maximumSlots: z.coerce
    .number()
    .min(0, {
      message: 'Please enter a valid slot count'
    })
    .nullish()
});

export type EventFormValues = z.infer<typeof EventFormSchema>;

export const useAdminEventForm = (event?: Event) => {
  const navigate = useNavigate();
  const eventId = event?.eventId;
  const mode = eventId ? 'edit' : 'create';
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();
  const form = useForm<EventFormValues>({
    mode: 'onChange',
    resolver: zodResolver(EventFormSchema),
    defaultValues: async () => {
      if (event) {
        return event;
      }

      return {
        name: '',
        description: '',
        email: '',
        startDate: '',
        endDate: '',
        venue: '',
        autoConfirm: false,
        paidEvent: false,
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
        const successTitle = mode === 'edit' ? 'Event updated' : 'Event created';
        const successMessage = mode === 'edit' ? 'Event updated successfully' : 'Event created successfully';
        successToast({
          title: successTitle,
          description: successMessage
        });

        if (mode === 'create') {
          const { eventId: newEventId } = response.data;
          navigate(`/admin/events/${newEventId}`);
        }

        if (mode === 'edit') {
          form.reset(values);
        }
      } else {
        const toastMessage = mode === 'edit' ? 'Error in updating an event' : 'Error in creating an event';
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

  const cancel = () => {
    if (eventId) {
      form.reset();
    } else {
      navigate('/admin/events');
    }
  };

  return {
    form,
    submit,
    cancel
  };
};
