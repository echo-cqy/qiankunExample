import React, { useMemo } from 'react';
import { useRoutes, BrowserRouter, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Space, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useUserStore } from './store/user';
import { constantRoutes, asyncRoutes } from './routes/config';
import { filterRoutesByPermission, AppRouteObject } from './utils/permission';
import ProtectedRoute from './components/ProtectedRoute';

const { Header, Content, Sider } = Layout;

function Router() {
  const token = useUserStore((state) => state.token);
  const permissions = useUserStore((state) => state.permissions);

  // 计算最终路由
  const routes = useMemo(() => {
    // 1. 过滤动态路由
    const accessedRoutes = token 
      ? filterRoutesByPermission(asyncRoutes, permissions)
      : [];

    // 2. 递归包裹 ProtectedRoute
    const wrapRoutes = (routes: AppRouteObject[]): AppRouteObject[] => {
      return routes.map(route => {
        const newRoute = { ...route };
        if (newRoute.element) {
          // 将 element 包裹在守卫中
          newRoute.element = (
            <ProtectedRoute route={route}>
              {route.element}
            </ProtectedRoute>
          );
        }
        if (newRoute.children) {
          newRoute.children = wrapRoutes(newRoute.children);
        }
        return newRoute;
      });
    };

    // 3. 合并路由
    return [...constantRoutes, ...wrapRoutes(accessedRoutes)];
  }, [token, permissions]);

  // 使用 useRoutes 渲染
  return useRoutes(routes);
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, reset } = useUserStore();
  
  // 仅在非登录/404/403页显示 Layout
  const isFullScreen = ['/login', '/404', '/403'].includes(location.pathname);

  if (isFullScreen) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    reset();
    navigate('/login');
  };

  const menuItems = [
    { key: '/dashboard', label: '数据看板' },
    { key: '/flow', label: '审批中心' },
    { key: '/designer', label: '流程设计' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>微前端管理平台</div>
        <Space>
           <span style={{ color: 'white' }}>Welcome, {username}</span>
           <Button type="text" icon={<LogoutOutlined />} style={{ color: 'white' }} onClick={handleLogout}>退出</Button>
        </Space>
      </Header>
      <Layout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname.split('/')[1] ? `/${location.pathname.split('/')[1]}` : '']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Router />
      </MainLayout>
    </BrowserRouter>
  );
}
