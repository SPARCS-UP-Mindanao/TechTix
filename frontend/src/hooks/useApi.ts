import { createApiReturn } from "@/api/utils/createApi";
import { useQuery } from "@tanstack/react-query";

interface QueryOptions {
  active?: boolean;
  suspense?: boolean;
  keepPreviousData?: boolean;
}

export function useApi<T>(
  api: createApiReturn<T>,
  {
    active = true,
    suspense = false,
    keepPreviousData = false,
  }: QueryOptions = {}
) {
  return useQuery(api.queryKey, api.queryFn, {
    enabled: active,
    suspense,
    keepPreviousData,
  });
}
