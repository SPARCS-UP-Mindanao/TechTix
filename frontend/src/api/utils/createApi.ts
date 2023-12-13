import axios, { AxiosError, AxiosResponse } from 'axios';
import { getCookie } from 'typescript-cookie';
import { refreshOnIntercept } from '@/utils/refreshToken';
import { QueryKey } from '@tanstack/react-query';

type SearchParamType = string | string[] | number | number[] | boolean | Record<string, any> | Date | null | undefined;

type SearchParams = Record<string, SearchParamType>;

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

const createQueryKey = (url: string, body?: SearchParams) => [url, body];
export type ApiService = 'auth' | 'events';
interface createApiProps<D, T = D> {
  method?: 'get' | 'post' | 'delete' | 'patch' | 'put';
  authorize?: boolean;
  apiService?: ApiService;
  url: string;
  queryParams?: any;
  body?: SearchParams;
  timeout?: number;
  output?: (dto: D) => T;
}

export type GenericReturn<T> = AxiosResponse<T> & CustomAxiosError;

export function createApi<D, T = D>(
  { method = 'get', url, authorize = false, apiService = 'events', queryParams = {}, body, timeout = 1000 * 60, output }: createApiProps<D, T>,
  staleTime?: number,
  cacheTime?: number
) {
  const baseURL = apiService === 'events' ? import.meta.env.VITE_API_EVENTS_BASE_URL : import.meta.env.VITE_API_AUTH_BASE_URL;
  const api = axios.create();
  const queryFn = async (signal?: AbortSignal) => {
    const accessToken = getCookie('_auth')!;
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
          })
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

  authorize && refreshOnIntercept(api);

  return {
    queryKey: createQueryKey(url, body) as unknown as QueryKey,
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
