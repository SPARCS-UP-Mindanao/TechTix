import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { claimCertificate } from '@/api/evaluations';
import { ClaimCertificateResponse } from '@/api/evaluations';
import { useNotifyToast } from './useNotifyToast';
import { zodResolver } from '@hookform/resolvers/zod';

interface ClaimCertificateFormProps {
  eventId: string;
  setCurrentStep: React.Dispatch<React.SetStateAction<'EventInformation' | 'Evaluation_1' | 'Evaluation_2' | 'ClaimCertificate'>>;
  nextStep: () => void;
  EVALUATE_STEPS: readonly ['EventInformation', 'Evaluation_1', 'Evaluation_2', 'ClaimCertificate'];
}

const ClaimCertificateSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  })
});

export type ClaimCertificateFormSchema = z.infer<typeof ClaimCertificateSchema>;

export const useCheckEmailForm = ({ eventId, setCurrentStep, nextStep, EVALUATE_STEPS }: ClaimCertificateFormProps) => {
  const { errorToast } = useNotifyToast();
  const [data, setData] = useState<ClaimCertificateResponse | null>(null);

  const claimCertificateForm = useForm<z.infer<typeof ClaimCertificateSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ClaimCertificateSchema),
    defaultValues: {
      email: ''
    }
  });

  const submit = claimCertificateForm.handleSubmit(async (values) => {
    const { queryFn: checkEmail } = claimCertificate(values.email, eventId);
    const response = await checkEmail();
    // TO FIX: Ensure data arrives
    if (response.status === 200) {
      if (!response.data?.isFirstClaim) {
        setCurrentStep('ClaimCertificate');
        console.log('Already Claimed');
      } else {
        nextStep();
      }
      setData(() => response?.data);
    } else if (response.status === 404) {
      errorToast({
        title: 'Email not found',
        description: 'Please check your email address and try again.'
      });
    } else if (response.status === 400) {
      errorToast({
        title: 'Certificate Template Unavailable',
        description: 'Please try again later or refresh the page.'
      });
    }
    console.log(response);
  });

  return {
    claimCertificateForm,
    submit,
    data
  };
};
