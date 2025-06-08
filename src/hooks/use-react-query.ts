import camelcaseKeys from 'camelcase-keys';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { ApiResponse } from '@/models/common';

export function useReactQuery<TQueryFnData = unknown, TData = TQueryFnData>(
  options: Omit<
    UseQueryOptions<ApiResponse<TQueryFnData>, Error, ApiResponse<TData>>,
    'select'
  > & {
    select?: (data: ApiResponse<TQueryFnData>) => ApiResponse<TData>;
  },
): UseQueryResult<ApiResponse<TData>, Error> {
  return useQuery({
    ...options,
    select: data => {
      const camelCased = camelcaseKeys(
        data as unknown as Record<string, unknown>,
        {
          deep: true,
        },
      );
      return options.select
        ? options.select(camelCased as unknown as ApiResponse<TQueryFnData>)
        : (camelCased as unknown as ApiResponse<TData>);
    },
  });
}
