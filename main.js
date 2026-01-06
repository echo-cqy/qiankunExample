import { registerMicroApps, start } from 'qiankun';

const state = {
  theme: 'light',
  roles: JSON.parse(localStorage.getItem('qiankun_roles')) || ['guest'],
};

const permissionMap = {
  guest: ['/approvals'],
  admin: ['/approvals', '/designer', '/dashboard'],
};

function canAccess(path) {
  const all = new Set(state.roles.flatMap(r => permissionMap[r] || []));
  return all.has(path);
}

function renderUserControls() {
  const container = document.getElementById('user-controls');
  if (!container) return;
  const isAdmin = state.roles.includes('admin');
  
  container.innerHTML = `
    <span style="font-size: 14px; margin-right: 8px; color: #fff;">
      当前: ${isAdmin ? '管理员' : '访客'}
    </span>
    <button id="login-btn" style="padding: 4px 12px; font-size: 12px; cursor: pointer;">
      ${isAdmin ? '退出' : '登录'}
    </button>
  `;
  
  document.getElementById('login-btn').onclick = () => {
    if (isAdmin) {
      state.roles = ['guest'];
    } else {
      state.roles = ['admin'];
    }
    localStorage.setItem('qiankun_roles', JSON.stringify(state.roles));
    location.reload();
  };
}

function setActive(path) {
  const buttons = [...document.querySelectorAll('nav button[data-path]')];
  buttons.forEach(b => b.classList.toggle('active', b.dataset.path === path));
}

function setupNav() {
  renderUserControls();
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