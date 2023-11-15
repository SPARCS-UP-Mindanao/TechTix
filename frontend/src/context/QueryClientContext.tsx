import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ReactQueryProviderProps {
  children?: ReactNode;
}

const queryClient = new QueryClient();

export const ReactQueryProvider: React.JSXElementConstructor<ReactQueryProviderProps> = ({ children }: ReactQueryProviderProps) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
