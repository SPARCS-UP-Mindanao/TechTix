import { useContext } from 'react';
import { createApiReturn } from '@/api/utils/createApi';
import { ApiContext } from '@/context/QueryClientContext';
import { QueryClient, useQuery } from '@tanstack/react-query';

interface QueryOptions {
  active?: boolean;
}

export const useApiQuery = <T>(request: createApiReturn<T>, { active = true }: QueryOptions = {}) => {
  const api = useApi();
  return useQuery({
    queryKey: request.queryKey,
    queryFn: ({ signal }) => api.execute(request, signal),
    enabled: active,
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

  invalidateQueries<T>(request: createApiReturn<T>) {
    return this.queryClient.invalidateQueries({ queryKey: request.queryKey });
  }
}

export const useApi = () => {
  const client = useContext(ApiContext);
  if (!client) {
    throw new Error('useApi should be used within a QueryClientProvider');
  }

  return client;
};
