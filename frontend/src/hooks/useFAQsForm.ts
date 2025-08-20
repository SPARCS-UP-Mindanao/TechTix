import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { ulid } from 'ulid';
import { z } from 'zod';
import { updateFAQs } from '@/api/events';
import { CustomAxiosError } from '@/api/utils/createApi';
import { removeFAQIds } from '@/model/events';
import useAdminEvent from './useAdminEvent';
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';
import { zodResolver } from '@hookform/resolvers/zod';

const FAQSchema = z.object(
  {
    id: z.string().optional(),
    question: z.string().min(1, {
      message: 'Please enter a question'
    }),
    answer: z.string().min(1, {
      message: 'Please enter a answer'
    })
  },
  {
    required_error: 'Please enter a question and answer'
  }
);

const FAQsFormSchema = z
  .object({
    faqs: z.array(FAQSchema).optional(),
    isActive: z.boolean()
  })
  .refine(
    (data) => {
      if (data.isActive && (data.faqs === undefined || data.faqs.length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: 'Please add at least one FAQ',
      path: ['faqs']
    }
  );

export type FAQsFormValues = z.infer<typeof FAQsFormSchema>;
type FAQ = z.infer<typeof FAQSchema>;

export const useFAQsForm = (eventFAQs: FAQsFormValues) => {
  const api = useApi();
  const { successToast, errorToast } = useNotifyToast();
  const { eventId } = useAdminEvent();
  const form = useForm<FAQsFormValues>({
    mode: 'onChange',
    resolver: zodResolver(FAQsFormSchema),
    defaultValues: async () => ({
      isActive: eventFAQs?.isActive ?? false,
      faqs: eventFAQs?.faqs ?? []
    })
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'faqs'
  });

  const addFAQ = useCallback((FAQ: FAQ) => append({ ...FAQ, id: ulid() }), [append]);
  const removeFAQ = useCallback((index: number) => remove(index), [remove]);
  const moveFAQ = useCallback((startIndex: number, endIndex: number) => move(startIndex, endIndex), [move]);

  const submit = form.handleSubmit(async (values) => {
    try {
      const response = await api.execute(updateFAQs(eventId, removeFAQIds(values)));
      if (response.status === 200) {
        successToast({
          title: 'FAQs updated successfully',
          description: 'FAQs will now be visible in event registrations'
        });
        form.reset(() => values);
      } else {
        const errorData = response.errorData;
        errorToast({
          title: 'Failed to update FAQs',
          description: errorData.message || errorData.detail[0].msg
        });
      }
    } catch (error) {
      const { errorData } = error as CustomAxiosError;
      errorToast({
        title: 'Failed to update FAQs',
        description: errorData.message || errorData.detail[0].msg
      });
    }
  });

  return {
    form,
    faqs: fields,
    addFAQ,
    removeFAQ,
    moveFAQ,
    submit
  };
};
