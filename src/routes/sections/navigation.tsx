import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { AuthGuard } from 'src/auth/guard';

const DatabaseComponent = lazy(() => import('src/pages/database/database'));
const ChatComponent = lazy(() => import('src/pages/dashboard/one'));
const FileManagementComponent = lazy(() => import('src/pages/file_management/file_management'));
const FilesListComponent = lazy(() => import('src/pages/database/files_list'));

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const navigationRoutes = [
  {
    path: '/',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        path: 'database',
        children: [
          { element: <DatabaseComponent />, index: true },
          { path: 'files_list', element: <FilesListComponent /> },
        ],
      },
      {
        path: 'dashboard/personal',
        children: [
          { element: <ChatComponent />, index: true },
        ],
      },
      {
        path: 'file_management',
        children: [
          { element: <FileManagementComponent />, index: true },
        ],
      },
    ],
  },
];
