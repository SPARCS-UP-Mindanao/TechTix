import { getEvent } from '@/api/events';
import { useApiQuery } from '@/hooks/useApi';
import { useMetaData } from '@/hooks/useMetaData';

export const useEvaluatePage = (eventId: string) => {
  const { data: response, isFetching } = useApiQuery(getEvent(eventId));
  const setMetaData = useMetaData();

  setMetaData({
    title: response?.data?.name,
    iconUrl: response?.data?.logoUrl
  });

  return {
    response,
    isFetching
  };
};
