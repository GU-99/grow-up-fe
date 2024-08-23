import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/globals.css';
import MainRouter from '@routes/MainRouter.tsx';
import { CookiesProvider } from 'react-cookie';

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import('./mocks/browser');
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <CookiesProvider>
        <MainRouter />
      </CookiesProvider>
    </React.StrictMode>,
  );
});
