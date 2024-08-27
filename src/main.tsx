import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import MainRouter from '@routes/MainRouter.tsx';
import { queryClient } from '@hooks/query/queryClient';
import '@/globals.css';

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import('./mocks/browser');
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MainRouter />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
