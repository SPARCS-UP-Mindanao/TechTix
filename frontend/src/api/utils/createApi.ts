/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey } from "@tanstack/react-query";
import axios from "axios";

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
  method?: "get" | "post" | "delete" | "patch";
  url: string;
  baseURL?: string;
  params?: SearchParams;
  timeout?: number;
  output?: (dto: D) => T;
}

export function createApi<D, T = D>({
  method = "get",
  url,
  baseURL = import.meta.env.VITE_API_BASE_URL,
  params,
  timeout = 1000 * 60,
  output,
}: createApiProps<D, T>) {
  const queryFn = async () => {
    const response = await axios({
      baseURL,
      method,
      url,
      data: params,
      timeout,
      headers: {},
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
