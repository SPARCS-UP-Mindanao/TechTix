import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext, useWatch } from 'react-hook-form';
import { ulid } from 'ulid';
import { getDiscount } from '@/api/discounts';
import { getEvent, getEventRegCountStatus } from '@/api/events';
import { Event } from '@/model/events';
import { getPathFromUrl, isEmpty, reloadPage, scrollToView } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterField, RegisterFormValues } from '../../hooks/useRegisterForm';
import { calculateTotalPrice } from '../pricing';
import { RegisterStep, STEP_PAYMENT, STEP_SUCCESS, STEP_TICKET_SELECTION } from '../steps/RegistrationSteps';
import { usePayment } from '../usePayment';

export const useRegisterFooter = (
  event: Event,
  steps: RegisterStep[],
  currentStep: RegisterStep,
  fieldsToCheck: RegisterField[],
  setCurrentStep: (step: RegisterStep) => void
) => {
  const { eventId } = event;
  const api = useApi();
  const navigate = useNavigate();
  const { errorToast } = useNotifyToast();

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const { trigger, setValue, getValues, control } = useFormContext<RegisterFormValues>();
  const [paymentChannel, paymentMethod, transactionFee, discountPercentage, sprintDay] = useWatch({
    control,
    name: ['paymentChannel', 'paymentMethod', 'transactionFee', 'discountPercentage', 'sprintDay']
  });

  const baseUrl = getPathFromUrl(window.location.href);

  const { eWalletRequest, directDebitRequest } = usePayment(baseUrl, eventId);

  const currentIndex = steps.indexOf(currentStep);

  // Calculate if this is a free ticket (total = 0)
  const total = calculateTotalPrice({
    price: event.price,
    transactionFee: transactionFee ?? 0,
    discountPercentage: discountPercentage ?? 0,
    platformFee: event.platformFee ?? 0,
    sprintDayPrice: sprintDay && event.sprintDayPrice ? event.sprintDayPrice : 0
  });

  const isFreeTicket = total === 0;

  // For free tickets, don't require payment method selection
  const paymentButtonDisabled = isFreeTicket ? false : isEmpty(paymentChannel) || isEmpty(paymentMethod) || isEmpty(transactionFee);

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

  // Function to set the total price
  const setPaymentTotal = () => {
    const total = Number(
      calculateTotalPrice({
        price: event.price,
        transactionFee: transactionFee ?? 0,
        discountPercentage: discountPercentage ?? 0,
        platformFee: event.platformFee ?? 0,
        sprintDayPrice: sprintDay && event.sprintDayPrice ? event.sprintDayPrice : 0
      }).toFixed(2)
    );

    setValue('total', total);
  };

  const onNextStep = async () => {
    saveFormState();
    const moveToNextStep = () => {
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
        scrollToView();
      }
    };

    if (isEmpty(fieldsToCheck)) {
      moveToNextStep();
    } else {
      // For Payment&Verification step with free tickets, filter out payment fields
      let validationFields = fieldsToCheck;
      if (currentStep.id === 'Payment&Verification' && isFreeTicket) {
        validationFields = fieldsToCheck.filter((field) => field !== 'paymentMethod' && field !== 'paymentChannel' && field !== 'transactionFee');
      }

      const isValid = await trigger(validationFields);

      if (isValid) {
        moveToNextStep();
        scrollToView();
      } else {
        errorToast({
          id: 'form-error-' + ulid(),
          title: 'There are errors in the form',
          description: 'Please review the form and try again.'
        });
      }
    }
  };

  const onPrevStep = () => {
    saveFormState();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const onSummaryStep = () => {
    // For free tickets, allow proceeding even without transaction fee
    if (!isFreeTicket && !transactionFee) {
      return;
    }

    // Set the total field in the form
    if (isFreeTicket) {
      setValue('total', 0);
    } else {
      setPaymentTotal();
    }
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
    const isValid = await trigger(fieldsToCheck);

    if (!isValid) {
      errorToast({
        id: 'form-error-' + ulid(),
        title: 'There are errors in the form',
        description: 'Please review the form and try again.'
      });
      return;
    }

    const [total, selectedTicket, discountCode] = getValues(['total', 'ticketType', 'validCode']);

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

    if (selectedTicket) {
      // refetch event to get latest info
      const event = await api.execute(getEvent(eventId));

      if (!event.data || event.status !== 200) {
        return;
      }

      const ticketTypeFromEvent = event.data.ticketTypes?.find((x) => x.id === selectedTicket);

      // return error if ticket type is not found
      if (!ticketTypeFromEvent) {
        errorToast({
          title: 'Ticket type not found',
          description: 'Your ticket type is invalid. Please select another ticket type.'
        });
        setCurrentStep(STEP_TICKET_SELECTION);
        return;
      }

      // return error if ticket type is sold out
      if (ticketTypeFromEvent.maximumQuantity === ticketTypeFromEvent.currentSales) {
        errorToast({
          title: 'Ticket type is sold out',
          description: 'Sorry, but your selected ticket type is already sold out. Please select another ticket type to register.'
        });
        setCurrentStep(STEP_TICKET_SELECTION);
        return;
      }
    }

    // recheck discount code
    if (discountCode) {
      const response = await api.execute(getDiscount(discountCode, eventId));
      const discount = response.data;

      const isDiscountUsedUp = discount.maxDiscountUses !== null ? discount.remainingUses === 0 : discount.claimed;

      // return error if discount code is used up
      if (isDiscountUsedUp) {
        errorToast({
          title: 'Discount Code is already used up',
          description: 'The discount code you entered has already been claimed to its maximum. Please enter a different discount code.'
        });
        setValue('validCode', '');
        setCurrentStep(STEP_PAYMENT);
        return;
      }
    }

    if (sprintDay) {
      const event = await api.execute(getEvent(eventId));

      if (!event.data || event.status !== 200) {
        return;
      }

      console.log(event.data);

      if (event.data.maximumSprintDaySlots === event.data.sprintDayRegistrationCount) {
        setValue('sprintDay', false);
        errorToast({
          title: 'Sprint Day is full',
          description: 'Sorry, but the Sprint Day slots are already full. Your registration will proceed without Sprint Day.'
        });
        return;
      }
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

  const onViewRegistrationDetails = () => {
    navigate(`/${eventId}/register/details`);
  };

  return {
    paymentButtonDisabled,
    isFormSubmitting,
    onNextStep,
    onPrevStep,
    onSummaryStep,
    onSubmitForm,
    onViewRegistrationDetails
  };
};
