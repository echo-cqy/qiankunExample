import type { AxiosRequestConfig } from 'axios';

// 1. 定义统一的接口返回结构 (Backend Contract)
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 2. 扩展 AxiosRequestConfig 以支持自定义配置 (Request Level Config)
declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 是否跳过 Token 注入 */
    skipAuth?: boolean;
    /** 是否跳过默认的错误处理（如 Toast） */
    skipErrorHandler?: boolean;
    /** 内部重试计数 */
    __retryCount?: number;
  }
}

// 3. 定义统一的业务错误模型 (Frontend Error Model)
export class BusinessError extends Error {
  public readonly code: number;
  public readonly isBusinessError = true;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'BusinessError';
  }
}

// 4. 实例化配置
export interface CreateClientOptions {
  baseURL: string;
  timeout?: number;
  getToken: () => string | undefined;
  onUnauthorized: () => void;
  onBusinessError?: (error: BusinessError) => void;
}
