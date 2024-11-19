import { Navigate, useRoutes } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';
import { navigationRoutes } from './navigation';
import { Chatnavigation } from './chat';

// ----------------------------------------------------------------------

export function Router() {
  const chatRoutes = Chatnavigation(); // 使用 Chatnavigation 生成路由配置
  
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={CONFIG.auth.redirectPath} replace />,
    },

    // Auth
    ...authRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Main
    ...mainRoutes,

    // Navigation
    ...navigationRoutes,

    // Chatnavigation
    ...chatRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
