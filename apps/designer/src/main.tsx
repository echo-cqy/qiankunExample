import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

function Canvas() {
  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const node = document.createElement('div');
    node.style.position = 'absolute';
    node.style.left = `${e.clientX - 50}px`;
    node.style.top = `${e.clientY - 50}px`;
    node.style.width = '100px';
    node.style.height = '40px';
    node.style.background = '#22c55e';
    node.style.color = '#fff';
    node.style.display = 'flex';
    node.style.alignItems = 'center';
    node.style.justifyContent = 'center';
    node.innerText = '节点';
    e.currentTarget.appendChild(node);
  };
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => e.preventDefault();
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ width: 140 }}>
        <div draggable style={{ padding: 8, background: '#2563eb', color: '#fff' }}>拖拽到画布</div>
        <div style={{ marginTop: 8 }}><Link to="/">返回</Link></div>
      </div>
      <div onDrop={onDrop} onDragOver={onDragOver} style={{ flex: 1, height: 420, border: '1px dashed #999', position: 'relative' }}>
        画布（拖拽蓝色块到此）
      </div>
    </div>
  );
}

function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h3>流程设计器</h3>
      <Link to="/canvas">进入画布</Link>
    </div>
  );
}

const routes = [
  { path: '/', element: <Home /> },
  { path: '/canvas', element: <Canvas /> },
];

function render(props?: { container?: HTMLElement }) {
  const basename = qiankunWindow.__POWERED_BY_QIANKUN__ ? '/designer' : '/';
  const router = createBrowserRouter(routes, { basename });
  const rootEl = props?.container ? props.container.querySelector('#root') : document.getElementById('root');
  const root = ReactDOM.createRoot(rootEl!);
  root.render(<RouterProvider router={router} />);
}

renderWithQiankun({
  mount(props) { render(props as any); },
  bootstrap() {},
  unmount(props) { const el = props.container ? props.container.querySelector('#root') : document.getElementById('root'); if (el) (el as any).innerHTML = ''; }
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}