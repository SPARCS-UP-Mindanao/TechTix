import React from 'react';
import { Amplify } from 'aws-amplify';
import ReactDOM from 'react-dom/client';
// import { registerSW } from 'virtual:pwa-register';
import '@/styles/index.css';
import App from './App.tsx';
import config from '@amplify_outputs';

// registerSW({ immediate: true });

Amplify.configure(config);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
