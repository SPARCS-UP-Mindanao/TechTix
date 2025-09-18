import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateEvent, createEvent, getAdminEvent } from '@/api/events';
import { CustomAxiosError } from '@/api/utils/createApi';
import { Event, EventStatus, mapCreateEventValues, mapEventToFormValues, mapUpdateEventValues } from '@/model/events';
import { isEmpty } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

const EventFormSchema = z
  .object({
    name: z.string().min(1, {
      error: 'Please enter the event name'
    }),
    description: z.string().min(1, {
      error: 'Please enter the event description'
    }),
    email: z.email({
      error: 'Please enter a valid email address'
    }),
    startDate: z.string().min(1, {
      error: 'Please enter the event start date'
    }),
    endDate: z.string().min(1, {
      error: 'Please enter the event end date'
    }),
    venue: z.string().min(1, {
      error: 'Please enter the event venue'
    }),
    paidEvent: z.boolean(),
    price: z.coerce.number<number>().min(0, {
      error: 'Please enter the event price'
    }),
    status: z.custom<EventStatus>().refine((value) => !isEmpty(value), {
      error: 'Please select the event status'
    }),
    bannerLink: z.string().optional(),
    logoLink: z.string().optional(),
    certificateTemplate: z.string().optional(),
    isLimitedSlot: z.boolean(),
    isApprovalFlow: z.boolean(),
    maximumSlots: z.coerce.number<number>().optional(),
    ticketTypes: z
      .array(
        z.object({
          name: z.string().min(1, {
            error: 'Please enter the ticket type name'
          }),
          description: z.string().optional(),
          tier: z.string().min(1, {
            error: 'Please enter the ticket type tier'
          }),
          originalPrice: z.coerce.number<number>().optional(),
          price: z.coerce.number<number>().min(0, {
            error: 'Please enter the ticket type price'
          }),
          maximumQuantity: z.coerce.number<number>().min(0, {
            error: 'Please enter the ticket type maximum quantity'
          })
        })
      )
      .optional(),
    hasMultipleTicketTypes: z.boolean(),
    isUsingPlatformFee: z.boolean(),
    platformFee: z.coerce.number<number>().optional(),
    sprintDay: z.boolean(),
    sprintDayPrice: z.coerce.number<number>().optional(),
    isSprintDayLimitedSlot: z.boolean(),
    maximumSprintDaySlots: z.coerce.number<number>().optional(),
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
      error: 'Please enter a value more than 0',
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
      error: 'Please enter a value more than 0',
      path: ['maximumSlots']
    }
  )
  .refine(({ sprintDay, sprintDayPrice }) => (sprintDay ? sprintDayPrice && sprintDayPrice > 0 : true), {
    error: 'Please enter a value more than 0',
    path: ['sprintDayPrice']
  })
  .refine(({ isUsingPlatformFee, platformFee }) => (isUsingPlatformFee ? platformFee && platformFee < 0 : true), {
    error: 'Please enter a value more than 0',
    path: ['platformFee']
  });

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
        status: 'draft',
        ticketTypes: [],
        hasMultipleTicketTypes: false,
        isUsingPlatformFee: false,
        sprintDay: false,
        sprintDayPrice: 0,
        isSprintDayLimitedSlot: false,
        maximumSprintDaySlots: undefined,
        sprintDayRegistrationCount: 0  
      };
    }
  });

  const onInvalid = () => {
    errorToast({
      id: 'form-error',
      title: 'Form error',
      description: 'Please fill in all the required fields'
    });
  };

  const submit = form.handleSubmit(
    async (values) => {
      const toastMessage = mode === 'edit' ? 'Error in updating an event' : 'Error in creating an event';

      try {
        const response = await (eventId
          ? api.execute(updateEvent(eventId, mapUpdateEventValues(values)))
          : api.execute(createEvent(mapCreateEventValues(values))));

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
            api.invalidateQueries(getAdminEvent(eventId!));
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
    },
    () => {
      onInvalid();
    }
  );

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
