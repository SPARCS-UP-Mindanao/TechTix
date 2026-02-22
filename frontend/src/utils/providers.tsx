import React from 'react';
import AuthContextProvider from '@/context/AuthContext';
import { ReactQueryProvider } from '@/context/QueryClientContext';
import { RouteProvider } from '@/context/RouteContext';
import { ThemeProvider } from '@/context/ThemeContext';

interface Props {
  components: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>;
}

const Compose = ({ components = [] }: Props) => {
  return components.reduceRight(
    (acc, Comp) => {
      return React.createElement(Comp, {}, acc);
    },
    <></>
  );
};

export const Providers = () => {
  const providers = Compose({
    components: [ReactQueryProvider, ThemeProvider, AuthContextProvider, RouteProvider]
  });

  return providers;
};
