import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createDiscount } from '@/api/discounts';
import { CustomAxiosError } from '@/api/utils/createApi';
import { Discount, CreateDiscount } from '@/model/discount';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

const DiscountFormSchema = z.object({
  discountPercentage: z
    .number()
    .min(1, {
      message: 'Enter number between 1-100'
    })
    .max(100, {
      message: 'Enter number between 1-100'
    }),
  quantity: z
    .number()
    .min(1, {
      message: 'Please enter a valid quantity'
    })
    .optional(),
  organizationName: z.string().min(1, {
    message: 'Please enter a valid organization name'
  }),
  isReusable: z.boolean(),
  maxDiscountUses: z
    .number()
    .min(1, {
      message: 'Please enter a valid discount uses'
    })
    .optional(),
  discountName: z
    .string()
    .min(1, {
      message: 'Please enter a valid discount name'
    })
    .optional(),
  remainingUses: z
    .number()
    .min(1, {
      message: 'Please enter a valid remaining uses'
    })
    .optional()
});

export type DiscountFormValues = z.infer<typeof DiscountFormSchema>;

export const useDiscountForm = (eventId: string) => {
  const [discountCodes, setDiscountCodes] = useState<string[]>([]);
  const [showDiscountCodes, setShowDiscountCodes] = useState(false);
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(DiscountFormSchema),
    defaultValues: {
      discountPercentage: 1,
      quantity: 1,
      organizationName: '',
      isReusable: false,
      maxDiscountUses: undefined,
      discountName: undefined,
      remainingUses: undefined
    }
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      console.log('Form values before submit:', values);

      if (values.isReusable) {
        if (!values.maxDiscountUses || values.maxDiscountUses < 1) {
          form.setError('maxDiscountUses', {
            message: 'Max discount uses is required when discount is reusable'
          });
          return;
        }
        if (!values.discountName?.trim()) {
          form.setError('discountName', {
            message: 'Discount name is required when discount is reusable'
          });
          return;
        }
      }

      const submitValues: CreateDiscount = {
        discountPercentage: values.discountPercentage / 100,
        ...(values.quantity && { quantity: values.quantity }),
        organizationName: values.organizationName,
        isReusable: values.isReusable,
        ...(values.maxDiscountUses && { maxDiscountUses: values.maxDiscountUses }),
        ...(values.discountName && { discountName: values.discountName }),
        ...(values.isReusable && values.maxDiscountUses && { remainingUses: values.maxDiscountUses })
      };

      const response = await api.execute(createDiscount(submitValues, eventId));

      if (response.status === 200 || response.status === 201) {
        successToast({
          title: 'Discount Created Successfully',
          description: `Discount Created for ${values.organizationName}`
        });

        setDiscountCodes(response.data.map(({ entryId }) => entryId));
        setShowDiscountCodes(true);

        form.reset({
          discountPercentage: 1,
          quantity: 1,
          organizationName: '',
          isReusable: false,
          maxDiscountUses: undefined,
          discountName: undefined
        });
      } else {
        errorToast({
          title: 'Error in Creating Discount',
          description: 'An error occurred while creating discount. Please try again.'
        });
      }
    } catch (e) {
      console.error('Submit error:', e);
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in Creating Discount',
        description: errorData?.message || errorData?.detail?.[0]?.msg || 'An unexpected error occurred'
      });
    }
  });

  return {
    discountCodes,
    showDiscountCodes,
    setShowDiscountCodes,
    form,
    submit
  };
};
