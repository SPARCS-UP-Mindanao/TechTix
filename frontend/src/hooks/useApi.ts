import { createApiReturn } from '@/api/utils/createApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface QueryOptions {
  active?: boolean;
  suspense?: boolean;
  keepPreviousData?: boolean;
}

export const useApi = <T>(api: createApiReturn<T>, { active = true, suspense = false, keepPreviousData = false }: QueryOptions = {}) => {
  return useQuery(api.queryKey, api.queryFn, {
    enabled: active,
    suspense,
    keepPreviousData,
    staleTime: Infinity,
    retry: 3
  });
};

export const useFetchQuery = <T>() => {
  const queryClient = useQueryClient();
  const fetchQuery = async (api: createApiReturn<T>) => await queryClient.fetchQuery(api.queryKey, api.queryFn);
  return { fetchQuery };
};
