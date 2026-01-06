import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';

let root: ReactDOM.Root | null = null;

function render(props: any) {
  const { container } = props;
  const dom = container ? container.querySelector('#root') : document.getElementById('root');
  const basename = props.basename || (props.name ? `/${props.name}` : '/');
  
  if (dom) {
    root = ReactDOM.createRoot(dom);
    root.render(
      <React.StrictMode>
        <Router basename={basename} />
      </React.StrictMode>
    );
  }
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props: any) {
  console.log('props from main framework', props);
  render(props);
}

export async function unmount(props: any) {
  if (root) {
    root.unmount();
    root = null;
  }
}

// Default export for qiankun
export default { bootstrap, mount, unmount };
