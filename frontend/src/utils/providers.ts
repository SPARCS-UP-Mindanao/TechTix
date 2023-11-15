import React from 'react';
import { ReactQueryProvider } from '@/context/QueryClientContext';
import { RouteProvider } from '@/context/RouteContext';
import { ThemeProvider } from '@/context/ThemeContext';

interface Props {
  components: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>;
  children: React.ReactNode;
}

export const Compose = ({ components = [], children }: Props) => {
  return components.reduceRight((acc, Comp) => {
    return React.createElement(Comp, {}, acc);
  }, children);
};

export const withProviders = (children: React.ReactNode) => {
  const providers = Compose({
    components: [ReactQueryProvider, ThemeProvider, RouteProvider],
    children
  });

  return providers;
};
