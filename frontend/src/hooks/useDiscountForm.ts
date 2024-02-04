import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createDiscount } from '@/api/discounts';
import { CustomAxiosError } from '@/api/utils/createApi';
import { Discount } from '@/model/discount';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

const DiscountFormSchema = z.object({
  discountPercentage: z.coerce.number().min(0, {
    message: 'Please enter a valid percentage'
  }),
  quantity: z.coerce.number().min(0, {
    message: 'Please enter a valid quantity'
  }),
  organizationName: z.string().min(1, {
    message: 'Please enter a valid name'
  })
});

export type DiscountFormValues = z.infer<typeof DiscountFormSchema>;

export const useDiscountForm = (eventId: string) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [showDiscountCodes, setShowDiscountCodes] = useState(false);
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();
  const form = useForm<DiscountFormValues>({
    mode: 'onChange',
    resolver: zodResolver(DiscountFormSchema),
    defaultValues: {
      discountPercentage: 0,
      quantity: 0,
      organizationName: ''
    }
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      const response = await api.execute(createDiscount(values, eventId));
      if (response.status === 200) {
        successToast({
          title: 'Discount Created Successfully',
          description: `Discount Created for ${values.organizationName}`
        });
        setDiscounts(response.data);
        setShowDiscountCodes(true);
      } else {
        errorToast({
          title: 'Error in Creating Discount',
          description: 'An error occurred while creating discount. Please try again.'
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
    discounts,
    showDiscountCodes,
    setShowDiscountCodes,
    form,
    submit
  };
};
