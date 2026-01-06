import { createClient, BusinessError } from '@platform/request-core';
import { message } from 'antd';

function resolveBaseURL(): string {
  if (import.meta.env.DEV) return 'http://localhost:4000/api';
  return '/api';
}

function getToken() {
  return localStorage.getItem('token') || undefined;
}

// 全局错误处理策略
function handleBusinessError(error: BusinessError) {
  console.error(`[Business Error ${error.code}] ${error.message}`);
  message.error(error.message);
}

// 1. 创建单例实例
export const httpClient = createClient({
  baseURL: resolveBaseURL(),
  timeout: 10000,
  getToken,
  onUnauthorized: () => {
    console.warn('登录失效，跳转登录页...');
    message.error('登录失效，请重新登录');
    // window.location.href = '/login';
  },
  onBusinessError: handleBusinessError,
});

// 2. 导出便捷的 request 方法
// 注意：request-core 的 request 方法返回的是 Promise<T>，其中 T 是 data 字段的类型
export const request = httpClient.request.bind(httpClient);
