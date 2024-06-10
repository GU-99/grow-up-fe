import type { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AfterLoginRoute({ children }: PropsWithChildren) {
  /**
   * ToDo: 로그인 기능이 완성되었을 때, 로그인 확인 로직 추가
   * 로그인 했을 때만, 사용할 수 있도록 경로를 설정하는 컴포넌트, 로그인 상태를 확인해주는 로직이 필요.
   * AfterLoginRoute BeforeLoginRoute 둘 다 로그인 확인 로직이 필요하므로, 공통 로직을 커스텀 훅으로 추출할 것.
   */
  const isAuthenticated = true;

  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  return children || <Outlet />;
}
