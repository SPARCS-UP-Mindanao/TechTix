import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEvent } from '@/api/events';
import { reloadPage } from '@/utils/functions';
import { useApiQuery } from '@/hooks/useApi';
import { useMetaData } from '@/hooks/useMetaData';
import { RegisterStep, RegisterStepId, STEP_BASIC_INFO, STEP_PAYMENT, STEP_SUCCESS } from './steps/RegistrationSteps';

export const useRegisterPage = (eventId: string, setCurrentStep: (step: RegisterStep) => void) => {
  const { data: response, isPending } = useApiQuery(getEvent(eventId));
  const setMetaData = useMetaData();
  const [searchParams] = useSearchParams();
  const stepFromUrl = searchParams.get('step');

  setMetaData({
    title: response?.data?.name,
    iconUrl: response?.data?.logoUrl
  });

  useEffect(() => {
    const savedState = localStorage.getItem('formState');

    if (savedState) {
      if (stepFromUrl) {
        switch (stepFromUrl as RegisterStepId) {
          case 'Success':
            setCurrentStep(STEP_SUCCESS);
            break;
          case 'Payment&Verification':
            setCurrentStep(STEP_PAYMENT);
            break;
          default:
            reloadPage();
            break;
        }
      }
    } else {
      setCurrentStep(STEP_BASIC_INFO);
    }
  }, [setCurrentStep, stepFromUrl]);

  return {
    response,
    isPending
  };
};
