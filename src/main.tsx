import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import SignUp from './pages/SignUp.tsx';

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import('./mocks/browser');
  return worker.start();
}

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: ,
  // },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
});
