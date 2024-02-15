import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { getEventRegistrationWithEmail } from '@/api/registrations';
import { Event } from '@/model/events';
import { baseUrl, isEmpty, reloadPage } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterField, RegisterFormValues } from '@/hooks/useRegisterForm';
import { RegisterStep, STEP_SUCCESS } from './Steps';
import { calculateTotalPrice } from './steps/PaymentStep';
import { usePayment } from './usePayment';

export const useRegisterFooter = (
  event: Event,
  steps: RegisterStep[],
  currentStep: RegisterStep,
  fieldsToCheck: RegisterField[],
  setCurrentStep: (step: RegisterStep) => void
) => {
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { errorToast } = useNotifyToast();
  const { trigger, setValue, getValues, watch } = useFormContext<RegisterFormValues>();
  const api = useApi();
  const { eventId } = useParams();
  const currentEmail = watch('email');
  const paymentChannel = watch('paymentChannel');
  const paymentMethod = watch('paymentMethod');
  const transactionFee = watch('transactionFee');
  const discountPercentage = watch('discountPercentage');
  const total = watch('total');

  const { eWalletRequest, directDebitRequest } = usePayment(baseUrl);

  const currentIndex = steps.indexOf(currentStep);

  const paymentButtonDisabled = isEmpty(paymentChannel) || isEmpty(paymentMethod) || isEmpty(transactionFee);

  const scrollToView = () => {
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.2;
    window.scrollTo({ top: scrollAmount, behavior: 'smooth' });
  };

  const validateEmail = async () => {
    if (!currentEmail || currentStep.id !== 'UserBio') {
      return true;
    }

    try {
      setIsValidatingEmail(true);
      const response = await api.execute(getEventRegistrationWithEmail(eventId!, currentEmail));
      switch (response.status) {
        case 200:
          errorToast({
            title: 'Email already registered',
            description: 'The email you entered has already been used. Please enter a different email.'
          });
          return false;
        case 404:
          return true;
        default:
          errorToast({
            title: 'Please try again',
            description: 'There was an error. Please try again.'
          });
          return false;
      }
    } catch (error) {
      errorToast({
        title: 'Please try again',
        description: 'There was an error. Please try again.'
      });
      return false;
    } finally {
      setIsValidatingEmail(false);
    }
  };

  const onNextStep = async () => {
    const moveToNextStep = () => {
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
        scrollToView();
      }
    };

    if (isEmpty(fieldsToCheck)) {
      moveToNextStep();
    } else {
      const isValid = await trigger(fieldsToCheck);
      if (isValid) {
        moveToNextStep();
        scrollToView();
      }
    }
  };

  const onPrevStep = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const onCheckEmailNextStep = async () => {
    const isValid = await validateEmail();
    if (isValid) {
      onNextStep();
    }
  };

  const onSummaryStep = () => {
    if (!transactionFee) {
      return;
    }

    const total = Number(calculateTotalPrice(event.price, transactionFee, discountPercentage).toFixed(2));
    setValue('total', total);
    onNextStep();
  };

  const saveFormState = () => {
    const formState = getValues();
    localStorage.setItem('formState', JSON.stringify(formState));
  };

  const onRequestPayment = async () => {
    if (!paymentMethod || !paymentChannel || !total) {
      return;
    }

    saveFormState();

    if (paymentMethod === 'E_WALLET') {
      await eWalletRequest(total, paymentChannel);
    } else if (paymentMethod === 'DIRECT_DEBIT') {
      await directDebitRequest(total, paymentChannel);
    }
  };

  const onSubmitForm = async () => {
    if (!event.payedEvent || total === 0) {
      setCurrentStep(STEP_SUCCESS);
    }

    try {
      setIsFormSubmitting(true);
      await onRequestPayment();
    } catch (error) {
      console.error(error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return {
    paymentButtonDisabled,
    isValidatingEmail,
    isFormSubmitting,
    onNextStep,
    onPrevStep,
    onCheckEmailNextStep,
    onSummaryStep,
    onSignUpOther: reloadPage,
    onSubmitForm
  };
};
