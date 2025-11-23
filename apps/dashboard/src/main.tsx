import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import Dashboard from './pages/Dashboard';

const routes = [
  { path: '/', element: <Dashboard /> },
];

function render(props?: { container?: HTMLElement }) {
  const basename = qiankunWindow.__POWERED_BY_QIANKUN__ ? '/dashboard' : '/';
  const router = createBrowserRouter(routes, { basename });
  const rootEl = props?.container ? props.container.querySelector('#root') : document.getElementById('root');
  const root = ReactDOM.createRoot(rootEl!);
  root.render(<RouterProvider router={router} />);
}

renderWithQiankun({
  mount(props) {
    render(props as any);
  },
  bootstrap() {},
  unmount(props) {
    const rootEl = props.container ? props.container.querySelector('#root') : document.getElementById('root');
    if (rootEl) (rootEl as any).innerHTML = '';
  },
  update(props) {
    render(props as any);
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}