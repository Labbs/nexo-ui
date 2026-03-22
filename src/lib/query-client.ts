import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,      // 30s — data considered fresh after fetch
      gcTime: 10 * 60_000,    // 10min — keep unused cache longer
    },
  },
})
