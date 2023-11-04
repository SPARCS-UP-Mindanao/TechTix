import axios, { AxiosError, AxiosResponse } from 'axios';
import { setCookie, getCookie, removeCookie } from 'typescript-cookie';
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

const createQueryKey = (url: string, params?: SearchParams) => [url, params];

interface createApiProps<D, T = D> {
  method?: 'get' | 'post' | 'delete' | 'patch' | 'put';
  authorize?: boolean;
  apiService?: 'auth' | 'events';
  url: string;
  queryParams?: any;
  params?: SearchParams;
  timeout?: number;
  output?: (dto: D) => T;
}

export function createApi<D, T = D>({
  method = 'get',
  url,
  authorize = true,
  apiService = 'events',
  queryParams = {},
  params,
  timeout = 1000 * 60,
  output
}: createApiProps<D, T>) {
  const baseURL = apiService === 'events' ? import.meta.env.VITE_API_EVENTS_BASE_URL : import.meta.env.VITE_API_AUTH_BASE_URL;
  const api = axios.create();
  const queryFn = async () => {
    type GenericReturn = AxiosResponse<T> & CustomAxiosError;
    const accessToken = getCookie('_auth')!;
    try {
      const response = await api({
        baseURL,
        method,
        url,
        params: queryParams,
        data: params,
        timeout,
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
        } as GenericReturn;
      }

      return response as GenericReturn;
    } catch (e) {
      const error = e as AxiosError;
      return {
        errorData: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: error.config,
        request: error.request,
        statusText: error.response?.statusText
      } as unknown as GenericReturn;
    }
  };

  api.interceptors.response.use(
    (response) => {
      return response;
    },

    async (error) => {
      const originalRequest = error.config;

      // Check if the error is due to an expired access token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // mark the request to avoid infinite retry loops

        const refreshToken = getCookie('_auth_refresh');
        const userId = getCookie('_auth_user');

        // Check if refresh token is available
        if (refreshToken && userId) {
          try {
            // Encapsulate token refresh logic in a function
            const response = await refreshAccessToken(refreshToken, userId);

            if (response.status !== 200) {
              resetAuth();
            }

            // Store the new token
            const newAccessToken = response.data.accessToken;
            setCookie('_auth', newAccessToken);

            // Update the header for the original request
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            // Retry the original request with the new token
            return api(originalRequest);
          } catch (refreshError) {
            resetAuth();
          }
        } else {
          resetAuth();
        }
      }

      // For errors not related to token expiration, just return the error
      return Promise.reject(error);
    }
  );

  async function refreshAccessToken(refreshToken: string, userId: string) {
    return await axios.post(`${import.meta.env.VITE_API_AUTH_BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken,
      sub: userId
    });
  }

  function resetAuth() {
    removeCookie('_auth_user');
    removeCookie('_auth');
    window.location.reload();
  }

  return {
    queryKey: createQueryKey(url, params) as unknown as QueryKey,
    queryFn
  };
}

export interface createApiReturn<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
}
