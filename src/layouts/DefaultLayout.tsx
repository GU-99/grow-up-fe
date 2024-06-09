import { Outlet } from 'react-router-dom';

export default function DefaultLayout() {
  return (
    <>
      <h3>Default Layout</h3>
      <Outlet />
    </>
  );
}
