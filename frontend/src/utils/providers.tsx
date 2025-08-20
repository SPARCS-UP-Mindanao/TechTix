import { ReactQueryProvider } from '@/context/QueryClientContext';
import { RouteProvider } from '@/context/RouteContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const Providers = () => {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <RouteProvider />
      </ThemeProvider>
    </ReactQueryProvider>
  );
};
