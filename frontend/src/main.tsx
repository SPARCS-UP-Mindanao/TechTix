import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '@/styles/index.css';
import App from './App.tsx';

let isReloading = false; // Flag to prevent multiple reloads

registerSW({
  immediate: true,
  onRegistered(r) {
    if (r && r.waiting) {
      r.addEventListener('controllerchange', () => {
        if (!isReloading) {
          isReloading = true;
          console.log('Service worker has updated, reloading the page...');
          window.location.reload();
        }
      });
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
