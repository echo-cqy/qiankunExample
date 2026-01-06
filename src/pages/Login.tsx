import React from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/user';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const handleLogin = (values: any) => {
    // 模拟登录请求
    if (values.username === 'admin') {
      const mockUserInfo = {
        userId: '123',
        username: 'admin',
        roles: ['admin'],
        permissions: ['flow:create', 'flow:approve', 'dashboard:view', 'flow:design'],
        token: 'mock-token-' + Date.now(),
      };
      setUserInfo(mockUserInfo);
      localStorage.setItem('token', mockUserInfo.token);
      message.success('登录成功');
      
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      // 访客
      const mockUserInfo = {
        userId: '456',
        username: 'guest',
        roles: ['guest'],
        permissions: ['flow:create'], // 只有部分权限
        token: 'mock-token-guest-' + Date.now(),
      };
      setUserInfo(mockUserInfo);
      localStorage.setItem('token', mockUserInfo.token);
      message.success('访客登录成功');
      
      const from = (location.state as any)?.from?.pathname || '/flow';
      navigate(from, { replace: true });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title="系统登录" style={{ width: 400 }}>
        <Form onFinish={handleLogin} initialValues={{ username: 'admin' }}>
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input placeholder="用户名 (admin / guest)" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="密码 (任意)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
