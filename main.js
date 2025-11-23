import { registerMicroApps, start } from 'qiankun';

const state = {
  theme: 'light',
  roles: ['guest'],
};

const permissionMap = {
  guest: ['/approvals'],
  admin: ['/approvals', '/designer', '/dashboard'],
};

function canAccess(path) {
  const all = new Set(state.roles.flatMap(r => permissionMap[r] || []));
  return all.has(path);
}

function setActive(path) {
  const buttons = [...document.querySelectorAll('nav button[data-path]')];
  buttons.forEach(b => b.classList.toggle('active', b.dataset.path === path));
}

function setupNav() {
  const nav = document.querySelector('nav');
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-path]');
    if (!btn) return;
    const path = btn.dataset.path;
    if (!canAccess(path)) {
      alert('无权限访问该子应用');
      return;
    }
    history.pushState({}, '', path);
    setActive(path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  setActive(location.pathname);
  window.addEventListener('popstate', () => setActive(location.pathname));
  if (location.pathname === '/') {
    history.replaceState({}, '', '/approvals');
    setActive('/approvals');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

setupNav();

registerMicroApps([
  {
    name: 'approvals',
    entry: '//localhost:3001',
    container: '#container',
    activeRule: '/approvals',
    props: { theme: state.theme, roles: state.roles },
  },
  {
    name: 'designer',
    entry: '//localhost:3002',
    container: '#container',
    activeRule: '/designer',
    props: { theme: state.theme, roles: state.roles },
  },
  {
    name: 'dashboard',
    entry: '//localhost:3003',
    container: '#container',
    activeRule: '/dashboard',
    props: { theme: state.theme, roles: state.roles },
  },
  {
    name: 'vueApp',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/app-vue',
  },
  {
    name: 'angularApp',
    entry: '//localhost:4200',
    container: '#container',
    activeRule: '/app-angular',
  },
]);
// 启动 qiankun
start();