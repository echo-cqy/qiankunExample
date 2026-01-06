import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './app/router';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { bootstrap, mount, unmount } from './app/index';
import './styles/designer.less';

// Independent run
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  );
} else {
  // Qiankun run
  renderWithQiankun({
    mount,
    bootstrap,
    unmount,
    update(props) {
      console.log('designer app update', props);
    },
  });
}
