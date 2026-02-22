import { useContext } from 'react';
import { createApiReturn } from '@/api/utils/createApi';
import { ApiContext } from '@/context/QueryClientContext';
import { QueryClient, useQuery } from '@tanstack/react-query';

interface QueryOptions {
  active?: boolean;
  suspense?: boolean;
  keepPreviousData?: boolean;
}

export const useApiQuery = <T>(request: createApiReturn<T>, { active = true, suspense = false, keepPreviousData = false }: QueryOptions = {}) => {
  const api = useApi();
  return useQuery(request.queryKey, ({ signal }) => api.execute(request, signal), {
    enabled: active,
    suspense,
    keepPreviousData,
    refetchOnWindowFocus: false,
    retry: 3
  });
};

export class ApiClient {
  constructor(private queryClient: QueryClient) {}

  execute<T>(request: createApiReturn<T>, signal?: AbortSignal) {
    if (!this.queryClient) {
      throw new Error('QueryClient is not initialized');
    }
    return request.queryFn(signal);
  }

  query<T>(request: createApiReturn<T>, signal?: AbortSignal) {
    return this.queryClient.fetchQuery(request.queryKey, () => this.execute(request, signal), { staleTime: request.staleTime, cacheTime: request.cacheTime });
  }

  invalidateQueries<T>(request: createApiReturn<T>) {
    return this.queryClient.invalidateQueries(request.queryKey);
  }
}

export const useApi = () => {
  const client = useContext(ApiContext);
  if (!client) {
    throw new Error('useApi should be used within a QueryClientProvider');
  }

  return client;
};
