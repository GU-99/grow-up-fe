import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function ToastLayout({ children }: PropsWithChildren) {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        theme="light"
        rtl={false}
        hideProgressBar
        newestOnTop={false}
        pauseOnFocusLoss={false}
        autoClose={3000}
        transition={Slide}
        draggable={false}
        closeOnClick
      />
      {children || <Outlet />}
    </>
  );
}
