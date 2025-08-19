import { getDownloadUrl } from '@/api/events';
import { useApiQuery } from './useApi';

export const useFileUrl = (eventId: string, key: string | null) => {
  const { data, isFetching } = useApiQuery(getDownloadUrl(eventId, key!), { active: !!key });

  return {
    fileUrl: data?.data.downloadLink,
    isFetching
  };
};
