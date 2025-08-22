import { fetchAuthSession } from 'aws-amplify/auth';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { getCookie } from 'typescript-cookie';
// import { refreshOnIntercept } from '@/utils/refreshToken';
import { QueryKey } from '@tanstack/react-query';

interface ErrorStringResponse {
  message: string;
}

interface ErrorObjectResponse {
  detail: [
    {
      loc: string[];
      msg: string;
      type: string;
    }
  ];
}

type ErrorResponse = ErrorStringResponse & ErrorObjectResponse;

export interface CustomAxiosError extends Omit<AxiosResponse, 'data'> {
  errorData: ErrorResponse;
}

export const createQueryKey = (url: string, body?: any) => [url, body];
export type ApiService = 'auth' | 'events' | 'payments';
interface createApiProps<D, T = D> {
  method?: 'get' | 'post' | 'delete' | 'patch' | 'put';
  authorize?: boolean;
  apiService?: ApiService;
  url: string;
  queryParams?: any;
  headers?: object;
  body?: any;
  timeout?: number;
  output?: (dto: D) => T;
}

const getUrl = (apiService: ApiService) => {
  const map: Record<ApiService, string> = {
    events: import.meta.env.VITE_API_EVENTS_BASE_URL,
    auth: import.meta.env.VITE_API_AUTH_BASE_URL,
    payments: import.meta.env.VITE_API_PAYMENT_BASE_URL
  };

  return map[apiService];
};

export type GenericReturn<T> = AxiosResponse<T> & CustomAxiosError;

export function createApi<D, T = D>(
  { method = 'get', url, authorize = false, apiService = 'events', queryParams = {}, headers, body, timeout = 1000 * 60, output }: createApiProps<D, T>,
  staleTime?: number,
  cacheTime?: number
) {
  const baseURL = getUrl(apiService);

  const api = axios.create();
  const queryFn = async (signal?: AbortSignal) => {
    const authSession = await fetchAuthSession();
    const accessToken = authSession?.tokens?.accessToken;

    try {
      const response = await api({
        baseURL,
        method,
        url,
        params: queryParams,
        data: body,
        timeout,
        signal,
        headers: {
          'Content-Type': 'application/json',
          ...(authorize && {
            Authorization: `Bearer ${accessToken}`
          }),
          ...headers
        }
      });

      if (output) {
        return {
          ...response,
          data: output(response.data)
        } as GenericReturn<T>;
      }

      return response as GenericReturn<T>;
    } catch (e) {
      const error = e as AxiosError;
      return {
        errorData: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: error.config,
        request: error.request,
        statusText: error.response?.statusText
      } as unknown as GenericReturn<T>;
    }
  };

  // TODO: Should fix?
  // authorize && refreshOnIntercept(api);

  return {
    queryKey: createQueryKey(url, body ?? queryParams) as unknown as QueryKey,
    queryFn,
    staleTime,
    cacheTime
  };
}

export interface createApiReturn<T> {
  queryKey: QueryKey;
  queryFn: (signal?: AbortSignal) => Promise<T>;
  staleTime?: number;
  cacheTime?: number;
}
