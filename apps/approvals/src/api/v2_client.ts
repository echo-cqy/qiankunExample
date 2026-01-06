import { createClient, BusinessError } from '@platform/request-core';

function getToken() {
  return localStorage.getItem('token') || undefined;
}

// 示例：全局错误处理策略
function handleBusinessError(error: BusinessError) {
  console.error(`[Business Error ${error.code}] ${error.message}`);
  // message.error(error.message); // 使用 UI 组件库提示
}

// 1. 创建单例实例
export const httpClient = createClient({
  baseURL: '/api/v2',
  timeout: 5000,
  getToken,
  onUnauthorized: () => {
    console.warn('登录失效，跳转登录页...');
    // window.location.href = '/login';
  },
  onBusinessError: handleBusinessError,
});

// 2. 导出便捷的 request 方法
export const request = httpClient.request.bind(httpClient);
