import { QueryKey } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "typescript-cookie";

type SearchParamType =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | Record<string, any>
  | Date
  | null
  | undefined;

type SearchParams = Record<string, SearchParamType>;

const createQueryKey = (url: string, params?: SearchParams) => [url, params];

interface createApiProps<D, T = D> {
  method?: "get" | "post" | "delete" | "patch" | "put";
  authorize?: boolean;
  apiService?: "auth" | "events";
  url: string;
  params?: SearchParams;
  timeout?: number;
  output?: (dto: D) => T;
}

export function createApi<D, T = D>({
  method = "get",
  url,
  authorize = true,
  apiService = "events",
  params,
  timeout = 1000 * 60,
  output,
}: createApiProps<D, T>) {
  const baseURL =
    apiService === "events"
      ? import.meta.env.VITE_API_EVENTS_BASE_URL
      : import.meta.env.VITE_API_AUTH_BASE_URL;
  const queryFn = async () => {
    const accessToken = getCookie("_auth")!;
    const response = await axios({
      baseURL,
      method,
      url,
      data: params,
      timeout,
      headers: {
        "Content-Type": "application/json",
        ...(authorize && {
          Authorization: `Bearer ${accessToken}`,
        }),
      },
    });

    if (output) {
      return output(response.data);
    }

    return response.data as T;
  };
  return {
    queryKey: createQueryKey(url, params) as unknown as QueryKey,
    queryFn,
  };
}

export interface createApiReturn<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
}
