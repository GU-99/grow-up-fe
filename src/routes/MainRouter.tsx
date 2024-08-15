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
import SearchIdPage from '@pages/user/SearchIdPage';
import SearchPasswordPage from '@pages/user/SearchPasswordPage';
import UserSettingPage from '@pages/setting/UserSettingPage';
import TeamSettingPage from '@pages/setting/TeamSettingPage';
import TeamPage from '@pages/team/TeamPage';
import CalendarPage from '@pages/project/CalendarPage';
import KanbanPage from '@pages/project/KanbanPage';
import ErrorPage from '@pages/ErrorPage';
import NotFoundPage from '@pages/NotFoundPage';
import UserAuthenticatePage from '@/pages/setting/UserAuthenticatePage';
import UserPasswordSettingPage from '@/pages/setting/UserPasswordSettingPage';

export default function MainRouter() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <BeforeLoginRoute>
          <ToastLayout>
            <AuthLayout />
          </ToastLayout>
        </BeforeLoginRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        { path: 'signup', element: <SignUpPage /> },
        { path: 'signin', element: <SignInPage /> },
        { path: 'search/id', element: <SearchIdPage /> },
        { path: 'search/password', element: <SearchPasswordPage /> },
      ],
    },
    {
      path: '/',
      element: (
        <AfterLoginRoute>
          <ToastLayout>
            <DefaultLayout />
          </ToastLayout>
        </AfterLoginRoute>
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
            { path: 'teams', element: <TeamSettingPage /> },
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
