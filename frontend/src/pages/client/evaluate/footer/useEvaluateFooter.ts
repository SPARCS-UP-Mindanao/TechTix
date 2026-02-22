import { useState } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { claimCertificate } from '@/api/evaluations';
import { Event } from '@/model/events';
import { isEmpty, scrollToView } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { DefaultEvaluateFormValues } from '@/hooks/useEvaluationForm';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { EvaluateStep, STEP_CLAIM_CERTIFICATE } from '../steps/EvaluationSteps';

const useEvaluateFooter = <T extends string>(
  event: Event,
  steps: EvaluateStep[],
  currentStep: EvaluateStep,
  fieldsToCheck: T[],
  setCurrentStep: (step: EvaluateStep) => void,
  submitForm: () => Promise<void>
) => {
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const { errorToast } = useNotifyToast();
  const api = useApi();
  const { eventId } = event;

  const { trigger, getValues, setValue } = useFormContext<DefaultEvaluateFormValues>();
  const { isSubmitting: isFormSubmitting } = useFormState();

  const currentIndex = steps.indexOf(currentStep);

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

  const validateEmail = async () => {
    if (!(await trigger(fieldsToCheck))) {
      return false;
    }

    try {
      setIsValidatingEmail(true);
      const response = await api.execute(claimCertificate(eventId!, getValues('email')));
      switch (response.status) {
        case 200:
          setValue('certificate', response.data);
          return true;
        case 404:
          errorToast({
            title: 'Email not found',
            description: 'The email you entered was not found. Please enter a email that was used to register.'
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
      return false;
    } finally {
      setIsValidatingEmail(false);
    }
  };

  const onStartEvaluate = async () => {
    const isValid = await validateEmail();
    if (isValid) {
      const isFirstClaim = getValues('certificate')?.isFirstClaim;
      if (!isFirstClaim) {
        setCurrentStep(STEP_CLAIM_CERTIFICATE);
        return;
      }
      onNextStep();
    }
  };

  const onSubmit = async () => {
    try {
      await submitForm();
      const response = await api.execute(claimCertificate(eventId!, getValues('email')));
      if (response.status === 200) {
        setValue('certificate', response.data);
        onNextStep();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    isValidatingEmail,
    isFormSubmitting,
    onNextStep,
    onPrevStep,
    onStartEvaluate,
    onSubmit
  };
};

export default useEvaluateFooter;
