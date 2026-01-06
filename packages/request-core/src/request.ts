import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CreateClientOptions, ApiResponse } from './types';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors';

export class HttpClient {
  private instance: AxiosInstance;

  constructor(options: CreateClientOptions) {
    // 1. 初始化 Axios 实例
    this.instance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout || 10000,
    });

    // 2. 安装拦截器
    this.instance.interceptors.request.use(
      setupRequestInterceptor(options.getToken)
    );

    const { onFulfilled, onRejected } = setupResponseInterceptor(
      options.onUnauthorized,
      options.onBusinessError
    );
    this.instance.interceptors.response.use(onFulfilled, onRejected);
  }

  // 3. 对外暴露类型安全的 request 方法
  // T: 接口返回的 data 字段的类型
  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config);
      // 由于响应拦截器已经处理了 data 解包逻辑（如果是成功），或者抛出了错误
      // 这里实际上拿到的 response.data 已经是 T 了，但在 TS 类型推断上 axios 默认返回 AxiosResponse
      // 所以我们需要做一点类型断言或调整拦截器返回类型
      // 为了保持标准 axios 行为，我们在拦截器只做检查，这里做解包
      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // 辅助方法：获取原始实例
  public getInstance() {
    return this.instance;
  }
}

// 工厂函数
export function createClient(options: CreateClientOptions) {
  return new HttpClient(options);
}
