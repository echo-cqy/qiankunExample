import { createClient } from 'utils';

function resolveBaseURL(): string {
  if (import.meta.env.DEV) return 'http://localhost:4000/api';
  return '/api';
}

const getToken = () => {
  return localStorage.getItem('token') || undefined;
};

// 模拟 Token 刷新逻辑
const refreshToken = async () => {
  // 实际场景中，这里应该调用刷新 Token 的 API
  // const res = await axios.post('/auth/refresh', { token: getToken() });
  // localStorage.setItem('token', res.data.token);
  // return res.data.token;
  
  console.log('Refreshing token...');
  return new Promise<string | null>((resolve) => {
    setTimeout(() => {
      const newToken = 'mock-new-token-' + Date.now();
      localStorage.setItem('token', newToken);
      resolve(newToken);
    }, 1000);
  });
};

export const client = createClient({
  getToken,
  baseURL: resolveBaseURL(),
  refreshToken,
  onUnauthorized: () => {
    console.log('Token expired and refresh failed, redirecting to login...');
    // window.location.href = '/login'; 
    // 或者使用事件总线通知 UI
  }
});
