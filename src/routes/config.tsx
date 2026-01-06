import { Navigate } from 'react-router-dom';
import type { AppRouteObject } from '../utils/permission';
import Login from '../pages/Login';
import NotFound from '../pages/404';
import Forbidden from '../pages/403';

// 静态路由：不需要权限
export const constantRoutes: AppRouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/403',
    element: <Forbidden />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  }
];

// 动态路由：需要权限
// 注意：这里仅定义路由结构，实际渲染内容是 Qiankun 容器
export const asyncRoutes: AppRouteObject[] = [
  {
    path: '/dashboard/*',
    element: <div id="dashboard-container" style={{ height: '100%' }} />, // Qiankun 挂载点
    meta: {
      title: '数据看板',
      permissions: ['dashboard:view'],
    },
  },
  {
    path: '/flow/*',
    element: <div id="approval-container" style={{ height: '100%' }} />, // Qiankun 挂载点
    meta: {
      title: '审批中心',
      permissions: ['flow:create', 'flow:approve'],
    },
  },
  {
    path: '/designer/*',
    element: <div id="designer-container" style={{ height: '100%' }} />, // Qiankun 挂载点
    meta: {
      title: '设计器',
      permissions: ['flow:design'],
    },
  },
  // Catch-all
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
];
