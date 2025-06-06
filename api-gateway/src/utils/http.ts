import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export async function forwardRequest(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> {
  return axios({
    method,
    url,
    data,
    ...config,
  });
}

export async function safeForwardRequest(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  config?: AxiosRequestConfig,
): Promise<{
  response: AxiosResponse | null;
  error: any;
}> {
  try {
    const response = await forwardRequest(url, method, data, config);
    return { response, error: null };
  } catch (error: any) {
    return { response: null, error };
  }
}
