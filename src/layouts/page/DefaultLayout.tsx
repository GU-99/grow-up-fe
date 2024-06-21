import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header';

export default function DefaultLayout() {
  return (
    <>
      <Header />
      <main className="m-auto h-contents max-w-contents">
        <Outlet />
      </main>
    </>
  );
}
