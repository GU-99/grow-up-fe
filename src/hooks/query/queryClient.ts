import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { MINUTE } from '@constants/units';
import type { QueryClientConfig } from '@tanstack/react-query';

// ToDo: 기본 옵션 설정 대화하고 확정하기
const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * MINUTE,
      gcTime: 10 * MINUTE,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(`Query: ${error.name}:${error.message}:${error.stack}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(`Mutation: ${error.name}:${error.message}:${error.stack}`);
    },
  }),
};

export const queryClient = new QueryClient(queryClientOptions);
