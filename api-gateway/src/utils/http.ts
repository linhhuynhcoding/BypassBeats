import axios, { AxiosRequestConfig, Method } from 'axios';

export async function forwardRequest(
  url: string,
  method: Method,
  data: any = null,
  config: AxiosRequestConfig = {},
) {
  const finalConfig: AxiosRequestConfig = {
    url,
    method,
    data,
    ...config,
  };

  return axios.request(finalConfig);
}
