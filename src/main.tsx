import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerMicroApps, start } from 'qiankun';
import App from './App';
import 'antd/dist/reset.css';

// 渲染主应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 注册子应用
registerMicroApps([
  {
    name: 'approvals',
    entry: '//localhost:3001',
    container: '#approval-container', // 对应 config.tsx 中的 ID
    activeRule: '/flow',
  },
  {
    name: 'dashboard',
    entry: '//localhost:3003',
    container: '#dashboard-container',
    activeRule: '/dashboard',
  },
  {
    name: 'designer',
    entry: '//localhost:3002',
    container: '#designer-container',
    activeRule: '/designer',
  },
]);

// 启动 qiankun
start();
