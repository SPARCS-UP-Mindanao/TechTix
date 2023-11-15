import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from '@/components/Toast/Toaster.tsx';
import { withProviders } from '@/utils/providers.ts';
import '@/styles/index.css';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {withProviders(<App />)}
    <Toaster />
  </React.StrictMode>
);
