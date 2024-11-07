import { useState } from 'react';
import { getCsvPreRegistrations } from '@/api/preregistrations';
import { CustomAxiosError } from '@/api/utils/createApi';
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';
import { getCsvRegistrations } from '@/api/registrations';

type ApiResponse = {
  data: {
    downloadLink: string;
    objectKey: string;
  };
  status: number;
  errorData?: any;
};

export const useGetCsv = (eventId: string) => {
  const { errorToast } = useNotifyToast();
  const [isGettingCsv, setIsGettingCsv] = useState(false);
  const api = useApi();

  const getCsv = async (reg_status: 'preregistrations' | 'registrations') => {
    try {
      setIsGettingCsv(true);
      
      let response: ApiResponse; 

      if( reg_status === 'preregistrations') {
        response = await api.execute(getCsvPreRegistrations(eventId));
      }
      else if (reg_status === 'registrations') {
        response = await api.execute(getCsvRegistrations(eventId));
      } else {
        console.error('Invalid reg_status');
        return;
      }
      
      if (response.status === 200) {
        const { data } = response;
        const link = document.createElement('a');
        link.href = data.downloadLink;
        link.download = data.objectKey;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const { errorData } = response;
        errorToast({
          title: 'Error in getting CSV',
          description: errorData.message || 'An error occurred while getting CSV. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in getting CSV',
        description: errorData.message || 'An error occurred while getting CSV. Please try again.'
      });
    } finally {
      setIsGettingCsv(false);
    }
  };

  return { getCsv, isGettingCsv };
};
