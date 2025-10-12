import { useState } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { claimCertificate } from '@/api/evaluations';
import { Event } from '@/model/events';
import { isEmpty, scrollToView } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { DefaultEvaluateFormValues } from '@/hooks/usePyconEvaluationForm';
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
  const context = useCurrentUser();
  console.log(context);
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

  const onStartEvaluate = async () => {
    const email = context?.user?.email || getValues('email');

    if (!email) {
      errorToast({
        title: 'Authentication Required',
        description: 'Please log in to continue.'
      });
      return;
    }

    try {
      setIsValidatingEmail(true);
      const response = await api.execute(claimCertificate(eventId!, email));

      if (response.status === 200) {
        setValue('certificate', response.data);

        const isFirstClaim = response.data?.isFirstClaim;
        if (!isFirstClaim) {
          setCurrentStep(STEP_CLAIM_CERTIFICATE);
          return;
        }

        onNextStep();
      } else if (response.status === 404) {
        errorToast({
          title: 'Registration Not Found',
          description: 'Your email was not found in the registration list for this event.'
        });
      } else {
        errorToast({
          title: 'Error',
          description: 'Unable to verify your registration. Please try again.'
        });
      }
    } catch (error) {
      errorToast({
        title: 'Error',
        description: 'An error occurred. Please try again.'
      });
    } finally {
      setIsValidatingEmail(false);
    }
  };

  const onSubmit = async () => {
    try {
      await submitForm();

      const email = context?.user?.email || getValues('email');

      if (email) {
        const response = await api.execute(claimCertificate(eventId!, email));
        if (response.status === 200) {
          setValue('certificate', response.data);
        }
      }

      onNextStep();
    } catch (error) {
      console.error(error);
      errorToast({
        title: 'Submission Error',
        description: 'There was an error submitting your evaluation. Please try again.'
      });
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
