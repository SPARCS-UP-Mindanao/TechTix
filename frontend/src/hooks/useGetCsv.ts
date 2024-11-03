import { useState } from 'react';
import { getCsvPreRegistrations } from '@/api/preregistrations';
import { CustomAxiosError } from '@/api/utils/createApi';
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';

export const useGetCsv = (eventId: string) => {
  const { errorToast } = useNotifyToast();
  const [isGettingCsv, setIsGettingCsv] = useState(false);
  const api = useApi();

  const getCsv = async () => {
    try {
      setIsGettingCsv(true);
      const response = await api.execute(getCsvPreRegistrations(eventId));
      const data = response.data;

      if (response.status === 200) {
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
