import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import App from './routes/App';
import Tasks from './routes/Tasks';
import Flow from './routes/Flow';

const routes = [
  { path: '/', element: <App /> },
  { path: '/tasks', element: <Tasks /> },
  { path: '/flow/:id', element: <Flow /> },
];

function render(props?: { container?: HTMLElement }) {
  const basename = qiankunWindow.__POWERED_BY_QIANKUN__ ? '/approvals' : '/';
  const router = createBrowserRouter(routes, { basename });
  const rootEl = props?.container ? props.container.querySelector('#root') : document.getElementById('root');
  const root = ReactDOM.createRoot(rootEl!);
  root.render(
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

renderWithQiankun({
  mount(props) {
    render(props as any);
  },
  bootstrap() {
    // noop
  },
  unmount(props) {
    const rootEl = props.container ? props.container.querySelector('#root') : document.getElementById('root');
    if (rootEl) {
      (rootEl as any).innerHTML = '';
    }
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}