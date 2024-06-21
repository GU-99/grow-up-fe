import { Outlet, useLocation } from 'react-router-dom';

export default function TeamLayout() {
  const location = useLocation();

  const hasProjectRoute = location.pathname.split('/').includes('projects');
  if (hasProjectRoute) return <Outlet />;

  return (
    <>
      <h3>Team Layout</h3>
      <Outlet />
    </>
  );
}
