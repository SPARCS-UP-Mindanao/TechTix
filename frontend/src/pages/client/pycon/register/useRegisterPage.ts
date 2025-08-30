import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getEvent } from '@/api/events';
import { getEventRegistrationWithEmail } from '@/api/pycon/registrations';
import { reloadPage } from '@/utils/functions';
import { useApiQuery } from '@/hooks/useApi';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMetaData } from '@/hooks/useMetaData';
import { RegisterStep, RegisterStepId, STEP_EVENT_DETAILS, STEP_PAYMENT, STEP_SUCCESS } from './steps/RegistrationSteps';

export const useRegisterPage = (eventId: string, setCurrentStep: (step: RegisterStep) => void) => {
  const auth = useCurrentUser();

  const { data: response, isPending } = useApiQuery(getEvent(eventId));
  const { data: userRegistration, isPending: isFetchingRegistration } = useApiQuery(getEventRegistrationWithEmail(eventId, auth?.user?.email!), {
    active: !!auth?.user?.email
  });

  const setMetaData = useMetaData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const stepFromUrl = searchParams.get('step');

  const hasExistingRegistration = userRegistration?.status === 200;

  setMetaData({
    title: response?.data?.name,
    iconUrl: response?.data?.logoUrl
  });

  useEffect(() => {
    const savedState = localStorage.getItem('formState');

    if (hasExistingRegistration) {
      navigate(`/${eventId}/register/details`);
    }

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
      setCurrentStep(STEP_EVENT_DETAILS);
    }
  }, [setCurrentStep, stepFromUrl, hasExistingRegistration]);

  return {
    response,
    isPending: isPending || isFetchingRegistration
  };
};
