import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { getTransactionDetails } from '@/api/payments';
import { useApi } from '@/hooks/useApi';
import { RegisterFormValues } from '@/hooks/useRegisterForm';

export const useTransactionFee = (eventPrice: number, platformFee: number | null, setIsFeesLoading: (val: boolean) => void) => {
  const api = useApi();
  const { getValues, setValue } = useFormContext<RegisterFormValues>();

  const ticketPrice = eventPrice;

  const getTransactionFee = useCallback(async () => {
    const [paymentChannel, paymentMethod] = getValues(['paymentChannel', 'paymentMethod']);

    if (!paymentChannel || !paymentMethod) {
      return;
    }
    setIsFeesLoading(true);
    setValue('transactionFee', undefined);
    const response = await api.execute(
      getTransactionDetails({ payment_channel: paymentChannel, payment_method: paymentMethod, ticket_price: ticketPrice, platform_fee: platformFee })
    );
    if (response.status === 200) {
      setValue('transactionFee', response.data.transaction_fee);

      if (response.data.platform_fee) {
        setValue('platformFee', response.data.platform_fee);
      }
    }
    setIsFeesLoading(false);
  }, [api, getValues, platformFee, setIsFeesLoading, setValue, ticketPrice]);

  return {
    getTransactionFee
  };
};
