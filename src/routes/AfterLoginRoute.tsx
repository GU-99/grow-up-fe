import useStore from '@stores/useStore';
import type { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AfterLoginRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, userInfo } = useStore();

  if (!isAuthenticated && !userInfo.userId) return <Navigate to="/signin" replace />;

  return children || <Outlet />;
}
