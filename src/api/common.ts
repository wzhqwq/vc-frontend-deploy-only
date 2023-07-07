import { MutationOptions, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { request } from './network'
import qs from 'qs'
import { useEffect } from 'react'
import { useSnackbar } from 'notistack'

export interface StandardResponse {
  code: number
  data: any
  msg?: string
  _links?: Link[]
}

export interface Link {
  method: string
  rel: string
  href: string
}

export type ToForm<T> = Omit<T, 'id' | '_links'>
export interface ResourceIdentifier {
  id: number
}

export function usePathMutation<TData = any, TVariables = any>(
  mutationKey: unknown[],
  method: string,
  options: MutationOptions<TData, Error, TVariables> = {},
) {
  const { enqueueSnackbar } = useSnackbar()
  return useMutation<TData, Error, TVariables, any>({
    ...options,
    mutationFn:
      options.mutationFn ??
      (async (variables) => {
        const type = mutationKey[0] as string
        const hasParams = typeof mutationKey.at(-1) === 'object'
        const useAuth = type === 'private'

        let path: string
        if (hasParams) {
          const pathArr = mutationKey.slice(1, -1)
          const params = mutationKey.at(-1) as any
          if ((variables as any).id !== undefined) {
            pathArr.push((variables as any).id)
            delete (variables as any).id
          }
          path = pathArr.join('/') + '?' + qs.stringify(params)
        } else {
          path = mutationKey.slice(1).join('/')
        }

        return await request(path, method, useAuth, variables)
      }),
    onError: (e, v, c) => {
      enqueueSnackbar(e.message, { variant: 'error' })
      options.onError?.(e, v, c)
    },
  })
}

export function usePost<TData = any, TVariables = any>(
  mutationKey: unknown[],
  options?: MutationOptions<TData, Error, TVariables>,
) {
  return usePathMutation<TData, TVariables>(mutationKey, 'POST', options)
}
export function usePut<TData = any, TVariables = any>(
  mutationKey: unknown[],
  options?: MutationOptions<TData, Error, TVariables>,
) {
  return usePathMutation<TData, TVariables>(mutationKey, 'PUT', options)
}
export function useDelete<TData = undefined, TVariables = undefined>(
  mutationKey: unknown[],
  options?: MutationOptions<TData, Error, TVariables>,
) {
  return usePathMutation<TData, TVariables>(mutationKey, 'DELETE', options)
}
export function usePatch<TData = any, TVariables = any>(
  mutationKey: unknown[],
  options?: MutationOptions<TData, Error, TVariables>,
) {
  return usePathMutation<TData, TVariables>(mutationKey, 'PATCH', options)
}

export function useErrorlessQuery<TData = unknown>(
  options: UseQueryOptions<TData, Error, TData, any[]>,
) {
  const result = useQuery(options)
  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    if (result.error) {
      enqueueSnackbar(result.error.message, { variant: 'error' })
    }
  }, [result.error, enqueueSnackbar])
  return result
}
