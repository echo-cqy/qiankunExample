import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T> { code: number; message: string; data: T }

export interface RequestConfig {
  getToken: () => string | undefined;
  baseURL?: string;
  refreshToken?: () => Promise<string | null>;
  onUnauthorized?: () => void; // Callback for login redirection
}

export class BusinessError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'BusinessError';
  }
}

let isRefreshing = false;
let requests: ((token: string) => void)[] = [];

export function createClient(getTokenOrConfig: (() => string | undefined) | RequestConfig, baseURL = '/api', refreshToken?: () => Promise<string | null>): AxiosInstance {
  let getToken: () => string | undefined;
  let getRefreshToken: (() => Promise<string | null>) | undefined = refreshToken;
  let onUnauthorized: (() => void) | undefined;

  if (typeof getTokenOrConfig === 'function') {
    getToken = getTokenOrConfig;
  } else {
    getToken = getTokenOrConfig.getToken;
    baseURL = getTokenOrConfig.baseURL ?? baseURL;
    getRefreshToken = getTokenOrConfig.refreshToken ?? refreshToken;
    onUnauthorized = getTokenOrConfig.onUnauthorized;
  }

  const client = axios.create({ baseURL, timeout: 10000 });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      const h: any = config.headers ?? {};
      if (typeof h.set === 'function') {
        h.set('Authorization', `Bearer ${token}`);
      } else {
        h['Authorization'] = `Bearer ${token}`;
      }
      config.headers = h;
    }
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const config: any = error.config;
      if (!config) return Promise.reject(error);

      // Handle 401 Token Refresh
      if (error.response?.status === 401 && getRefreshToken && !config.__isRetryRequest) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            requests.push((token) => {
              if (token) {
                if (typeof config.headers.set === 'function') {
                  config.headers.set('Authorization', `Bearer ${token}`);
                } else {
                  config.headers['Authorization'] = `Bearer ${token}`;
                }
                resolve(client(config));
              } else {
                resolve(Promise.reject(error));
              }
            });
          });
        }

        isRefreshing = true;
        config.__isRetryRequest = true;

        try {
          const newToken = await getRefreshToken();
          if (newToken) {
            requests.forEach((cb) => cb(newToken));
            requests = [];
            if (typeof config.headers.set === 'function') {
              config.headers.set('Authorization', `Bearer ${newToken}`);
            } else {
              config.headers['Authorization'] = `Bearer ${newToken}`;
            }
            return client(config);
          } else {
            // Refresh failed
            requests.forEach((cb) => cb(''));
            requests = [];
            onUnauthorized?.();
            return Promise.reject(error);
          }
        } catch (refreshErr) {
          requests.forEach((cb) => cb('')); // Or handle error
          requests = [];
          onUnauthorized?.();
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle Retry with Exponential Backoff (Only for idempotent GET requests)
      config.__retryCount = config.__retryCount || 0;
      const isIdempotent = config.method?.toUpperCase() === 'GET';
      const isNetworkOrServerErr = error.code === 'ECONNABORTED' || !error.response || error.response.status >= 500;
      
      if (isIdempotent && config.__retryCount < 3 && isNetworkOrServerErr) {
        config.__retryCount++;
        const backoff = Math.min(1000 * (2 ** (config.__retryCount - 1)), 30000); // 1s, 2s, 4s...
        await new Promise((r) => setTimeout(r, backoff));
        return client(config);
      }

      return Promise.reject(error);
    }
  );
  return client;
}

export async function request<T>(client: AxiosInstance, config: AxiosRequestConfig): Promise<T> {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await client.request(config);
    // 2️⃣ 业务错误处理 (Business Error)
    // 约定: code === 0 为成功，其他为业务异常
    if (res.data && res.data.code === 0) return res.data.data;
    throw new BusinessError(res.data?.code || -1, res.data?.message || 'Business Error');
  } catch (e: any) {
    // 3️⃣ 错误类型区分 (面试考点)
    
    // Case A: 主动取消 (Canceled)
    if (axios.isCancel(e)) {
      console.log('Request canceled', e.message);
      throw e; // 抛出给调用方处理 (如不显示错误提示)
    }

    // Case B: 业务错误 (BusinessError)
    if (e instanceof BusinessError) throw e;

    // Case C: 状态码错误 (Status Code Error) - e.response 存在
    // 已经在响应拦截器中统一处理了 401 等，这里主要处理 403, 404, 500 等遗漏情况
    if (e.response) {
      // 可以在这里做全局 Notification
      // console.error(`HTTP Error: ${e.response.status}`);
      throw e;
    }

    // Case D: 网络错误 (Network Error) - e.request 存在但无 response
    if (e.request) {
      // console.error('Network Error: No response received');
      throw new Error('Network Error: Please check your internet connection.');
    }

    // Case E: 其他错误 (Setup Error)
    throw e;
  }
}