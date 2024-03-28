import { useNavigate, useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateEvent, createEvent } from '@/api/events';
import { CustomAxiosError } from '@/api/utils/createApi';
import { Event, EventStatus, EventWithRefetchEvent, mapCreateEventValues, mapEventToFormValues } from '@/model/events';
import { isEmpty } from '@/utils/functions';
import { isValidContactNumber } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

const EventFormSchema = z
  .object({
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
      message: 'Please enter the event start date'
    }),
    endDate: z.string().min(1, {
      message: 'Please enter the event end date'
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
    bannerLink: z.string().optional(),
    logoLink: z.string().optional(),
    certificateTemplate: z.string().optional(),
    gcashQRCode: z.string().optional(),
    gcashName: z.string().optional(),
    gcashNumber: z
      .string()
      .refine(isValidContactNumber, {
        message: 'Please enter a valid PH contact number'
      })
      .optional(),
    isLimitedSlot: z.boolean(),
    isApprovalFlow: z.boolean(),
    maximumSlots: z.coerce.number().optional()
  })
  .refine(
    (data) => {
      // If paidEvent is true, then price should be required and greater than  0
      if (data.paidEvent && (data.price === undefined || data.price <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: 'Please enter a value more than 0',
      path: ['price']
    }
  )
  .refine(
    (data) => {
      // If isLimitedSlots is true, then maximumSlots should be required
      if (data.isLimitedSlot && (data.maximumSlots === undefined || data.maximumSlots <= 0)) {
        return false;
      }
      return true;
    },
    {
      message: 'Please enter a value more than 0',
      path: ['maximumSlots']
    }
  );

const extendRegisterFormSchema = (event: Event) =>
  EventFormSchema.refine(
    (data) => {
      // If isLimitedSlots is true, then maximumSlots should be greater than registrationCount
      if (data.isLimitedSlot && (data.maximumSlots === undefined || data.maximumSlots < event.registrationCount)) {
        return false;
      }
      return true;
    },
    {
      message: `Please enter a value larger than or equal to ${event.registrationCount} (Current registration count)`,
      path: ['maximumSlots']
    }
  );

export type EventFormValues = z.infer<typeof EventFormSchema>;

export const useAdminEventForm = (event?: Event) => {
  const formSchema = event ? extendRegisterFormSchema(event) : EventFormSchema;
  const { refetchEvent } = useOutletContext<EventWithRefetchEvent>();

  const navigate = useNavigate();
  const eventId = event?.eventId;
  const mode = eventId ? 'edit' : 'create';
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();
  const form = useForm<EventFormValues>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      if (event) {
        return mapEventToFormValues(event);
      }

      return {
        name: '',
        description: '',
        email: '',
        startDate: '',
        endDate: '',
        venue: '',
        paidEvent: false,
        isLimitedSlot: false,
        isApprovalFlow: false,
        price: 0,
        status: 'draft'
      };
    }
  });

  const onInvalid = () =>
    //TODO : Fix toast duplicaton
    errorToast({
      id: 'form-error',
      title: 'Form error',
      description: 'Please fill in all the required fields'
    });

  const submit = form.handleSubmit(async (values) => {
    const toastMessage = mode === 'edit' ? 'Error in updating an event' : 'Error in creating an event';

    try {
      const response = await (eventId ? api.execute(updateEvent(eventId, values)) : api.execute(createEvent(mapCreateEventValues(values))));

      if (response.status === 200) {
        const successTitle = mode === 'edit' ? 'Event updated' : 'Event created';
        const successMessage = mode === 'edit' ? 'Event updated successfully' : 'Event created successfully';
        successToast({
          title: successTitle,
          description: successMessage
        });

        if (mode === 'create') {
          form.reset();
          const { eventId: newEventId } = response.data;
          navigate(`/admin/events/${newEventId}`);
        }

        if (mode === 'edit') {
          form.reset(values);
          refetchEvent();
        }
      } else {
        errorToast({
          title: toastMessage,
          description: response.errorData.message || 'An error occurred while submitting. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: toastMessage,
        description: errorData.message || errorData.detail[0].msg
      });
    }
  }, onInvalid);

  const cancel = () => {
    if (eventId) {
      form.reset();
      form.clearErrors();
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
