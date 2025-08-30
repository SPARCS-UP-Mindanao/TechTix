import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ulid } from 'ulid';
import { createEwalletPaymentRequest, initiateDirectDebitPayment } from '@/api/pycon/payments';
import { PaymentChannel } from '@/model/pycon/payments';
import { mapCreateRegistrationDataForPayment } from '@/model/pycon/registrations';
import { useApi } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterFormValues } from '../hooks/useRegisterForm';

export const usePayment = (baseUrlPath: string, eventId: string) => {
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
      const values = getValues();
      setIsRequestingPayment(true);

      const response = await api.execute(
        createEwalletPaymentRequest({
          referenceId,
          eventId: eventId,
          amount: total,
          channelCode: paymentChannel,
          failureReturnUrl: `${baseUrlPath}?step=Payment`,
          successReturnUrl: `${baseUrlPath}?step=Success`,
          cancelReturnUrl: `${baseUrlPath}?step=Payment`,
          registrationData: mapCreateRegistrationDataForPayment(values, eventId)
        })
      );

      if (response.status === 200) {
        localStorage.setItem('referenceId', JSON.stringify(response.data.referenceId));
        window.location.href = response.data.paymentUrl;
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
      const values = getValues();
      setIsRequestingPayment(true);
      const response = await api.execute(
        initiateDirectDebitPayment({
          email,
          givenNames: firstName,
          surname: lastName,
          amount: total,
          channelCode: paymentChannel,
          failureReturnUrl: `${baseUrlPath}?step=Payment`,
          successReturnUrl: `${baseUrlPath}?step=Success`,
          eventId: eventId,
          registrationData: mapCreateRegistrationDataForPayment(values, eventId)
        })
      );

      if (response.status === 200) {
        localStorage.setItem('referenceId', JSON.stringify(response.data.referenceId));
        window.location.href = response.data.paymentUrl;
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
