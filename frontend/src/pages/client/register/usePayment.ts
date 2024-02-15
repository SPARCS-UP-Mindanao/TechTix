import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ulid } from 'ulid';
import { createEwalletPaymentRequest, initiateDirectDebitPayment } from '@/api/payments';
import { PaymentChannel } from '@/model/payments';
import { useApi } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterFormValues } from '@/hooks/useRegisterForm';

export const usePayment = (baseUrlPath: string) => {
  const api = useApi();
  const { errorToast } = useNotifyToast();
  const { getValues } = useFormContext<RegisterFormValues>();
  const email = getValues('email') ?? '';
  const firstName = getValues('firstName') ?? '';
  const lastName = getValues('lastName') ?? '';
  const [isRequestingPayment, setIsRequestingPayment] = useState(false);
  const referenceId = ulid();
  const eWalletRequest = async (total: number, paymentChannel: PaymentChannel) => {
    if (!total || !paymentChannel || (paymentChannel !== 'PAYMAYA' && paymentChannel !== 'GCASH')) {
      return;
    }
    try {
      setIsRequestingPayment(true);
      const response = await api.execute(
        createEwalletPaymentRequest({
          reference_id: referenceId,
          amount: total,
          channel_code: paymentChannel,
          failure_return_url: `${baseUrlPath}?step=Payment`,
          success_return_url: `${baseUrlPath}?step=Success`,
          cancel_return_url: `${baseUrlPath}?step=Payment`
        })
      );

      if (response.status === 200) {
        localStorage.setItem('referenceId', JSON.stringify(response.data.reference_id));
        window.location.href = response.data.payment_url;
      }
    } catch (error) {
      errorToast({
        title: 'Please try again',
        description: 'There was an error. Please try again.'
      });
      console.error(error);
    } finally {
      setIsRequestingPayment(false);
    }
  };

  const directDebitRequest = async (total: number, paymentChannel: PaymentChannel) => {
    if (!total || !paymentChannel || paymentChannel === 'PAYMAYA' || paymentChannel === 'GCASH') {
      return;
    }
    try {
      setIsRequestingPayment(true);
      const response = await api.execute(
        initiateDirectDebitPayment({
          email,
          given_names: firstName,
          surname: lastName,
          amount: total,
          channel_code: paymentChannel,
          failure_return_url: `${baseUrlPath}?step=Payment`,
          success_return_url: `${baseUrlPath}?step=Success`
        })
      );

      if (response.status === 200) {
        localStorage.setItem('referenceId', JSON.stringify(response.data.reference_id));
        window.location.href = response.data.payment_url;
      }
    } catch (error) {
      errorToast({
        title: 'Please try again',
        description: 'There was an error. Please try again.'
      });
      console.error(error);
    } finally {
      setIsRequestingPayment(false);
    }
  };

  return {
    isRequestingPayment,
    eWalletRequest,
    directDebitRequest
  };
};
