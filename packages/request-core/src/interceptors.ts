import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { BusinessError, CreateClientOptions, ApiResponse } from './types';

// =============================================================================
// 请求拦截器：注入 Token
// =============================================================================
export const setupRequestInterceptor = (getToken: () => string | undefined) => {
  return (config: InternalAxiosRequestConfig) => {
    // 策略：如果配置了 skipAuth，则跳过 Token 注入
    if (config.skipAuth) {
      return config;
    }

    const token = getToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  };
};

// =============================================================================
// 响应拦截器：错误收敛与稳定性治理
// =============================================================================
export const setupResponseInterceptor = (
  onUnauthorized: () => void,
  onBusinessError: (err: BusinessError) => void = () => {}
) => {
  
  const onFulfilled = (response: AxiosResponse<ApiResponse>) => {
    const { data, config } = response;
    
    // 1. 业务错误处理 (code !== 0)
    // 假设 0 为成功，其他均为业务异常
    if (data && data.code !== 0) {
      const error = new BusinessError(data.code, data.message || 'Unknown Business Error');
      
      // 策略：允许通过 skipErrorHandler 跳过全局 toast
      if (!config.skipErrorHandler) {
        onBusinessError(error);
      }
      
      return Promise.reject(error);
    }

    return response;
  };

  const onRejected = async (error: AxiosError) => {
    // 2. 主动取消请求 (AbortController)
    if (axios.isCancel(error)) {
      console.log('[Axios] Request canceled by user');
      return Promise.reject(error);
    }

    const config = error.config;
    if (!config) return Promise.reject(error);

    // 3. 登录态失效处理 (401)
    if (error.response?.status === 401) {
      onUnauthorized();
      return Promise.reject(error);
    }

    // 4. 稳定性能力：接口重试 (Retry)
    // 策略：仅针对 GET 请求 (幂等) && 网络/Server 错误
    const isGetRequest = config.method?.toUpperCase() === 'GET';
    const isNetworkOrServerError = !error.response || error.response.status >= 500;
    const retryCount = config.__retryCount || 0;
    const MAX_RETRY = 2;

    if (isGetRequest && isNetworkOrServerError && retryCount < MAX_RETRY) {
      config.__retryCount = retryCount + 1;
      
      // 指数退避：1s, 2s
      const backoff = 1000 * (2 ** (config.__retryCount - 1));
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      // 重新通过 axios 实例发送请求
      return axios(config);
    }

    // 5. 统一兜底错误
    // 将所有 HTTP 错误、网络错误收敛为 Error 对象抛出
    return Promise.reject(error);
  };

  return { onFulfilled, onRejected };
};
