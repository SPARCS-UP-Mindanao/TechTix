import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getTransactionDetails } from '@/api/payments';
import { useApi } from '@/hooks/useApi';
import { RegisterFormValues } from '@/hooks/useRegisterForm';

export const useTransactionFee = (eventPrice: number) => {
  const api = useApi();
  const [isTransactionFeeLoading, setTransactionFeeLoading] = useState(false);
  const { getValues, setValue } = useFormContext<RegisterFormValues>();

  const ticketPrice = eventPrice;

  const getTransactionFee = useCallback(async () => {
    const [paymentChannel, paymentMethod] = getValues(['paymentChannel', 'paymentMethod']);

    if (!paymentChannel || !paymentMethod) {
      return;
    }
    setTransactionFeeLoading(true);
    setValue('transactionFee', undefined);
    const response = await api.execute(getTransactionDetails({ payment_channel: paymentChannel, payment_method: paymentMethod, ticket_price: ticketPrice }));
    if (response.status === 200) {
      setValue('transactionFee', response.data.transaction_fee);
    }
    setTransactionFeeLoading(false);
  }, [api, getValues, setValue, ticketPrice]);

  return {
    isTransactionFeeLoading,
    getTransactionFee
  };
};
