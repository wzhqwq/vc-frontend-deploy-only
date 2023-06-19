import { QueryClient } from '@tanstack/react-query'
import { request } from './network'
import qs from 'qs'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      queryFn: async ({ queryKey, pageParam }) => {
        const type = queryKey[0] as string
        const hasParams = typeof queryKey.at(-1) === 'object'
        const useAuth = type === 'private'

        const path = hasParams
          ? queryKey.slice(1, -1).join('/') +
            '?' +
            qs.stringify({
              ...(queryKey.at(-1) as any),
              ...(pageParam ?? {}),
            })
          : queryKey.slice(1).join('/')
        
        return await request(path, 'GET', useAuth)
      },
    },
  },
})
