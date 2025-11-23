import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T> { code: number; message: string; data: T }

export function createClient(getToken: () => string | undefined, baseURL = '/api'): AxiosInstance {
  const client = axios.create({ baseURL, timeout: 8000 });
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
      const cfg: any = error.config || {};
      cfg.__retryCount = cfg.__retryCount || 0;
      if (cfg.__retryCount < 2) {
        cfg.__retryCount++;
        await new Promise((r) => setTimeout(r, 300 * cfg.__retryCount));
        return client(cfg);
      }
      return Promise.reject(error);
    }
  );
  return client;
}

export async function request<T>(client: AxiosInstance, config: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<ApiResponse<T>> = await client.request(config);
  if (res.data && res.data.code === 0) return res.data.data;
  throw new Error(res.data?.message || 'Request failed');
}