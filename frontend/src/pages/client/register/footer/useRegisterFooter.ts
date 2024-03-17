import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { getEventRegCountStatus } from '@/api/events';
import { checkPreRegistration } from '@/api/preregistrations';
import { getEventRegistrationWithEmail } from '@/api/registrations';
import { Event } from '@/model/events';
import { AcceptanceStatus, PreRegistration, mapPreRegistrationToFormValues } from '@/model/preregistrations';
import { baseUrl, isEmpty, reloadPage, scrollToView } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterField, RegisterFormValues } from '@/hooks/useRegisterForm';
import { calculateTotalPrice } from '../steps/PaymentStep';
import { RegisterStep, STEP_PAYMENT, STEP_SUCCESS } from '../steps/RegistrationSteps';
import { usePayment } from '../usePayment';

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
  const { trigger, setValue, getValues, watch, reset } = useFormContext<RegisterFormValues>();
  const api = useApi();
  const { eventId } = event;
  const watchedPaymentChannel = watch('paymentChannel');
  const watchedPaymentMethod = watch('paymentMethod');
  const watchedTransactionFee = watch('transactionFee');
  const watchedPercentageDiscount = watch('discountPercentage');

  const { eWalletRequest, directDebitRequest } = usePayment(baseUrl);

  const currentIndex = steps.indexOf(currentStep);

  const paymentButtonDisabled = isEmpty(watchedPaymentChannel) || isEmpty(watchedPaymentMethod) || isEmpty(watchedTransactionFee);

  const validateEmail = async () => {
    const email = getValues('email');

    try {
      setIsValidatingEmail(true);
      const response =
        event.status === 'preregistration'
          ? await api.execute(checkPreRegistration(eventId, email))
          : await api.execute(getEventRegistrationWithEmail(eventId, email));
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

  const checkRegistrationCount = async () => {
    const response = await api.execute(getEventRegCountStatus(eventId));
    if (response.status !== 200) {
      throw new Error('Registration count check failed');
    }

    const { registrationCount, maximumSlots } = response.data;

    if (maximumSlots && maximumSlots === registrationCount) {
      return true;
    }

    return false;
  };

  const checkAcceptanceStatus = (preRegistration: PreRegistration) => {
    const getTitleAndDescription = (acceptanceStatus: AcceptanceStatus) => {
      if (acceptanceStatus === 'REJECTED') {
        return {
          title: 'Your pre-registration was not accepted',
          description: `We're sorry but your registration wasn't accepted. Please feel free to join our future events.`
        };
      }

      if (acceptanceStatus === 'PENDING') {
        return {
          title: 'Your pre-registration is still being reviewed',
          description: `Please wait while we review your pre-registration. We'll send you an email when it's approved.`
        };
      }

      return {};
    };

    switch (preRegistration.acceptanceStatus) {
      case 'ACCEPTED':
        reset(mapPreRegistrationToFormValues(preRegistration));
        return true;
      default:
        errorToast(getTitleAndDescription(preRegistration.acceptanceStatus));
        return false;
    }
  };

  const getAndSetPreRegistration = async () => {
    const email = getValues('email');

    try {
      const response = await api.execute(checkPreRegistration(eventId, email));
      switch (response.status) {
        case 200:
          return checkAcceptanceStatus(response.data);

        case 404:
          errorToast({
            title: 'Email not found',
            description: 'The email you entered was not found. Please enter a different email.'
          });
          return false;

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
    }
  };

  const setPaymentTotal = () => {
    const total = Number(calculateTotalPrice(event.price, watchedTransactionFee, watchedPercentageDiscount).toFixed(2));
    setValue('total', total);
  };

  // If onNextStep is taking too long to load, add a loading state
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

  const onStartRegister = async () => {
    if (event.isApprovalFlow && event.status === 'open') {
      const isValid = await trigger(fieldsToCheck);
      if (!isValid) {
        return;
      }

      const hasPreRegistered = await getAndSetPreRegistration();
      const hasRegistered = await validateEmail();
      if (!hasPreRegistered || !hasRegistered) {
        return;
      }

      if (!event.paidEvent) {
        setCurrentStep(STEP_SUCCESS);
        return;
      }

      setCurrentStep(STEP_PAYMENT);
      return;
    }

    onNextStep();
  };

  const onCheckEmailNextStep = async () => {
    if (event.isApprovalFlow && event.status === 'open') {
      onNextStep();
      return;
    }

    const isValid = await validateEmail();
    if (isValid) {
      onNextStep();
    }
  };

  const onSummaryStep = () => {
    if (!watchedTransactionFee) {
      return;
    }

    setPaymentTotal();
    onNextStep();
  };

  const saveFormState = () => {
    const formState = getValues();
    localStorage.setItem('formState', JSON.stringify(formState));
  };

  const onRequestPayment = async () => {
    const { paymentMethod, paymentChannel, total } = getValues();
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
    const total = getValues('total');

    if (event.isApprovalFlow && event.status === 'preregistration') {
      setCurrentStep(STEP_SUCCESS);
    }

    if (!event.paidEvent || total === 0) {
      setCurrentStep(STEP_SUCCESS);
    }

    if (event.maximumSlots) {
      const isEventFull = await checkRegistrationCount();

      if (isEventFull) {
        reloadPage();
        return;
      }
    }

    if (event.isApprovalFlow && event.status === 'open') {
      setPaymentTotal();
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
    onStartRegister,
    onCheckEmailNextStep,
    onSummaryStep,
    onSignUpOther: reloadPage,
    onSubmitForm
  };
};
