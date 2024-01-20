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

export const useCheckEmailForm = ({ eventId, setCurrentStep, nextStep /* EVALUATE_STEPS */ }: ClaimCertificateFormProps) => {
  const { errorToast } = useNotifyToast();
  const [data, setData] = useState<ClaimCertificateResponse | null>(null);
  const [isClaimCertificateLoading, setisClaimCertificateLoading] = useState(false);

  const claimCertificateForm = useForm<z.infer<typeof ClaimCertificateSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ClaimCertificateSchema),
    defaultValues: {
      email: ''
    }
  });

  const checkEmail = claimCertificateForm.handleSubmit(async (values) => {
    try {
      setisClaimCertificateLoading(true);
      const { queryFn: checkEmail } = claimCertificate(values.email, eventId);
      const response = await checkEmail();

      // TO FIX: Ensure data arrives
      if (response.status === 200) {
        if (!response.data?.isFirstClaim) {
          setCurrentStep('ClaimCertificate');
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
    }
    catch (error) {
      errorToast({
        title: 'Error in checking email',
        description: 'Please try again later or refresh the page.'
      });
    }
    finally {
      setisClaimCertificateLoading(false);
    }
  });

  return {
    claimCertificateForm,
    checkEmail,
    data,
    isClaimCertificateLoading
  };
};
