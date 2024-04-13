import { useCallback } from 'react';
import { createQueryKey } from '@/api/utils/createApi';
import { PreRegisterFormValues } from '@/hooks/useRegisterForm';
import { RegisterStep } from './steps/RegistrationSteps';
import { useQuery } from '@tanstack/react-query';

const deleteFormState = () => localStorage.removeItem('formState');

export const useSuccess = (currentStep: RegisterStep, getValues: () => PreRegisterFormValues, submitForm: () => Promise<void>) => {
  const redirectToSuccess = useCallback(async () => {
    try {
      await submitForm();
      deleteFormState();
      return 'Success';
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }, [submitForm]);

  const { isFetching, isSuccess, refetch } = useQuery({
    queryKey: createQueryKey('submitForm', getValues()),
    queryFn: async () => redirectToSuccess(),
    enabled: currentStep.id === 'Success',
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  return {
    isSuccessLoading: isFetching,
    isRegisterSuccessful: isSuccess,
    retryRegister: refetch
  };
};
