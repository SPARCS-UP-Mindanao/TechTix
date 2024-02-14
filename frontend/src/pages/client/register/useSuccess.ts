import { useCallback } from 'react';
import { RegisterStep } from './Steps';
import { useQuery } from '@tanstack/react-query';

const deleteFormState = () => localStorage.removeItem('formState');

export const useSuccess = (currentStep: RegisterStep, submitForm: () => Promise<void>) => {
  const redirectToSuccess = useCallback(async () => {
    try {
      await submitForm();
      deleteFormState();
    } catch (error) {
      console.error(error);
    }
  }, [submitForm]);

  const { isFetching } = useQuery({
    queryKey: ['submitForm'],
    queryFn: async () => redirectToSuccess(),
    enabled: currentStep.id === 'Success',
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  return {
    isSuccessLoading: isFetching
  };
};
