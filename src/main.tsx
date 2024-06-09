import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainRouter from './routes/MainRouter.tsx';

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import('./mocks/browser');
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <MainRouter />
    </React.StrictMode>,
  );
});
