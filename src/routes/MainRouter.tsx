import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AfterLoginRoute from '@routes/AfterLoginRoute';
import BeforeLoginRoute from '@routes/BeforeLoginRoute';

import ToastLayout from '@layouts/ToastLayout';
import AuthLayout from '@layouts/page/AuthLayout';
import TeamLayout from '@layouts/page/TeamLayout';
import DefaultLayout from '@layouts/page/DefaultLayout';
import SettingLayout from '@layouts/page/SettingLayout';
import ProjectLayout from '@layouts/page/ProjectLayout';

import SignUpPage from '@pages/user/SignUpPage';
import SignInPage from '@pages/user/SignInPage';
import KakaoCallBack from '@components/user/KakaoCallBack';
import GoogleCallBack from '@components/user/GoogleCallBack';
import SearchIdPage from '@pages/user/SearchIdPage';
import SearchPasswordPage from '@pages/user/SearchPasswordPage';
import UserSettingPage from '@pages/setting/UserSettingPage';
import TeamPage from '@pages/team/TeamPage';
import CalendarPage from '@pages/project/CalendarPage';
import KanbanPage from '@pages/project/KanbanPage';
import ErrorPage from '@pages/ErrorPage';
import NotFoundPage from '@pages/NotFoundPage';
import TeamSettingLayout from '@layouts/page/TeamSettingLayout';
import UserAuthenticatePage from '@pages/setting/UserAuthenticatePage';
import UserPasswordSettingPage from '@pages/setting/UserPasswordSettingPage';
import TeamJoinedPage from '@pages/setting/TeamJoinedPage';
import TeamInvitedPage from '@pages/setting/TeamInvitedPage';

import { Interceptor } from '@services/axiosProvider';

export default function MainRouter() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        // ToDo: Interceptor 컴포넌트 적용 방식 리팩토링 고려
        <Interceptor>
          <BeforeLoginRoute>
            <ToastLayout>
              <AuthLayout />
            </ToastLayout>
          </BeforeLoginRoute>
        </Interceptor>
      ),
      errorElement: <ErrorPage />,
      children: [
        { path: 'signup', element: <SignUpPage /> },
        { path: 'signin', element: <SignInPage /> },
        { path: 'auth/kakao/callback', element: <KakaoCallBack /> },
        { path: 'auth/google/callback', element: <GoogleCallBack /> },
        { path: 'search/id', element: <SearchIdPage /> },
        { path: 'search/password', element: <SearchPasswordPage /> },
      ],
    },
    {
      path: '/',
      element: (
        // ToDo: Interceptor 컴포넌트 적용 방식 리팩토링 고려
        <Interceptor>
          <AfterLoginRoute>
            <ToastLayout>
              <DefaultLayout />
            </ToastLayout>
          </AfterLoginRoute>
        </Interceptor>
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <TeamPage /> },
        {
          path: 'setting',
          element: <SettingLayout />,
          children: [
            { index: true, element: <UserSettingPage /> },
            { path: 'user', element: <UserSettingPage /> },
            { path: 'auth', element: <UserAuthenticatePage /> },
            { path: 'password', element: <UserPasswordSettingPage /> },
            {
              path: 'teams',
              element: <TeamSettingLayout />,
              children: [
                { path: 'joined', element: <TeamJoinedPage /> },
                { path: 'invited', element: <TeamInvitedPage /> },
              ],
            },
          ],
        },
        {
          path: 'teams',
          element: <TeamLayout />,
          children: [
            { index: true, element: <TeamPage /> },
            {
              path: ':teamId',
              children: [
                { index: true, element: <TeamPage /> },
                {
                  path: 'projects/:projectId',
                  element: <ProjectLayout />,
                  children: [
                    { index: true, element: <CalendarPage /> },
                    { path: 'calendar', element: <CalendarPage /> },
                    { path: 'kanban', element: <KanbanPage /> },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    { path: '*', element: <NotFoundPage /> },
  ]);

  return <RouterProvider router={router} />;
}
