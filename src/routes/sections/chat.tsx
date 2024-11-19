import { lazy, Suspense, useEffect, useState } from 'react';
import request from 'src/utils/request';
import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { LoadingScreen } from 'src/components/loading-screen';
import { AuthGuard } from 'src/auth/guard';
import { Outlet, RouteObject } from 'react-router-dom';

const layoutContent = (
    <DashboardLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );

interface WorkspaceData {
    id: number;
    name: string;
    createTime: string;
    updateTime: string;
    selectedDatabase: string;
}


const ChatComponent = lazy(() => import('src/pages/chat/chat'));

export const Chatnavigation = () => {
    const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([]);

    const fetchWorkspaces = async () => {
        try {
            const response = await request.get<WorkspaceData[]>('/ragApplications/workspace/list');
            setWorkspaces(response.data);
        } catch (error) {
            console.error('Failed to fetch workspace data:', error);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);


    const routes: RouteObject[] = workspaces.map((workspace) => {
        const formattedWorkspaceName = workspace.name.replace(/\s+/g, '-'); // 替换空格为破折号
      
        return {
          path: `/${formattedWorkspaceName}`, // 使用格式化后的工作区名称
          element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
          children: [
            {
              path: 'chat',
              children: [
                { element: <ChatComponent />, index: true }, // 默认聊天组件
              ],
            },
          ],
        };
      });
      
      return routes;
};