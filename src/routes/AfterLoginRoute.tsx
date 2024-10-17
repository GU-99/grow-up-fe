import useStore from '@stores/useStore';
import type { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AfterLoginRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  return children || <Outlet />;
}
