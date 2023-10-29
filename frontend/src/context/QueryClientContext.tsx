import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";

interface ReactQueryProviderProps {
  children?: ReactNode;
}

const queryClient = new QueryClient();

export const ReactQueryProvider: React.JSXElementConstructor<
  ReactQueryProviderProps
> = ({ children }: ReactQueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
