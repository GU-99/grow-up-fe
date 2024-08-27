import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/globals.css';
import MainRouter from '@routes/MainRouter.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // QueryClient와 QueryClientProvider 임포트

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import('./mocks/browser');
  return worker.start();
}

const queryClient = new QueryClient();

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MainRouter />
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
