import { JSXElementConstructor, ReactNode, createContext } from 'react';
import { ApiClient } from '@/hooks/useApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ReactQueryProviderProps {
  children?: ReactNode;
}
export const ApiContext = createContext<ApiClient | undefined>(undefined);
const queryClient = new QueryClient();

export const ReactQueryProvider: JSXElementConstructor<ReactQueryProviderProps> = ({ children }: ReactQueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={new ApiClient(queryClient)}>{children}</ApiContext.Provider>
    </QueryClientProvider>
  );
};
