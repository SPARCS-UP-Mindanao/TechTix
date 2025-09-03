import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { getTransactionDetails } from '@/api/payments';
import { useApi } from '@/hooks/useApi';
import { RegisterFormValues } from '../hooks/useRegisterForm';
import { calculateDiscountedPrice, roundUpToTwoDecimals } from './pricing';

export const useTransactionFee = (
  eventPrice: number,
  platformFee: number | null,
  setIsFeesLoading: (val: boolean) => void,
  discountPercentage?: number | null,
  sprintDayPrice?: number | null
) => {
  const api = useApi();
  const { getValues, setValue } = useFormContext<RegisterFormValues>();

  const getTransactionFee = useCallback(async () => {
    const paymentChannel = getValues('paymentChannel');
    const paymentMethod = getValues('paymentMethod');
    const sprintDay = getValues('sprintDay');

    // Calculate the discounted price first to check if it's a free ticket
    const discountedPrice = calculateDiscountedPrice({
      price: eventPrice,
      discountPercentage: discountPercentage ?? 0
    });

    const currentSprintPrice = sprintDay && sprintDayPrice ? sprintDayPrice : 0;
    const totalTicketPrice = discountedPrice + currentSprintPrice;
    const isFreeTicket = totalTicketPrice === 0;

    if (!paymentChannel || !paymentMethod) {
      // For free tickets, we don't need payment methods, so stop loading
      if (isFreeTicket) {
        setIsFeesLoading(false);
        setValue('transactionFee', 0);
      }
      return;
    }

    // Total ticket price should include sprint day for transaction fee calculation
    // (already calculated above)

    setIsFeesLoading(true);
    setValue('transactionFee', undefined);
    const response = await api.execute(
      getTransactionDetails({
        payment_channel: paymentChannel,
        payment_method: paymentMethod,
        ticket_price: roundUpToTwoDecimals(totalTicketPrice),
        platform_fee: platformFee
      })
    );
    if (response.status === 200) {
      setValue('transactionFee', response.data.transaction_fee);
    }
    setIsFeesLoading(false);
  }, [api, getValues, platformFee, setIsFeesLoading, setValue, eventPrice, discountPercentage, sprintDayPrice]);

  return {
    getTransactionFee
  };
};
