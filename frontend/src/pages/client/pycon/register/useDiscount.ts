import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { getDiscount } from '@/api/discounts';
import { useApi } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterFormValues } from '@/hooks/useRegisterForm';

export const useDiscount = (eventPrice: number) => {
  const api = useApi();
  const { successToast, errorToast } = useNotifyToast();
  const { eventId } = useParams();
  const { watch, setValue } = useFormContext<RegisterFormValues>();

  const [isValidatingDiscountCode, setIsValidatingDiscountCode] = useState(false);
  const discountCode = watch('discountCode');
  const discountPercentage = watch('discountPercentage');
  const getDiscountPrice = (percentage: number) => eventPrice * (1 - percentage / 100);

  const validateDiscountCode = async () => {
    if (!discountCode) {
      errorToast({
        title: 'Discount Code is Empty',
        description: 'The discount code you entered is empty. Please enter a valid discount code.'
      });
      return;
    }

    try {
      setIsValidatingDiscountCode(true);
      const response = await api.execute(getDiscount(discountCode, eventId!));
      const discount = response.data;
      switch (response.status) {
        case 200:
          if (!discount.remainingUses) {
            errorToast({
              title: 'Discount Code is already used up',
              description: 'The discount code you entered has already been claimed to its maximum. Please enter a different discount code.'
            });
          } else {
            setValue('discountPercentage', discount.discountPercentage);
            setValue('discountedPrice', getDiscountPrice(discount.discountPercentage));
            successToast({
              title: 'Valid Discount Code',
              description: 'The discount code you entered is valid. Please proceed to the next step.'
            });
          }
          break;
        case 404:
          errorToast({
            title: 'Invalid Discount Code',
            description: 'The discount code you entered is invalid. Please enter a different discount code.'
          });
          break;
        default:
          errorToast({
            title: 'Please try again',
            description: 'There was an error. Please try again.'
          });
      }
    } catch (error) {
      console.error(error);
      errorToast({
        title: 'Please try again',
        description: 'There was an error. Please try again.'
      });
    } finally {
      setIsValidatingDiscountCode(false);
    }
  };

  return {
    discountPercentage,
    isValidatingDiscountCode,
    validateDiscountCode
  };
};
