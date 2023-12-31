import { useErrorlessQuery, usePost } from './common'
import { queryClient } from './queryClient'
import { useCallback, useEffect } from 'react'
import { User } from '@/types/entity/user'
import { useQuery } from '@tanstack/react-query'
import jwt_decode from 'jwt-decode'

export interface UserCreatingForm {
  email: string
  password: string
  confirmPassword: string
}
export type UserForm = Partial<UserCreatingForm>
export type LoginForm = Omit<UserCreatingForm, 'confirmPassword'>
export type JwtUserData = Pick<User, 'id' | 'role_id' | 'is_anon'>

export function useUser(userId?: number) {
  const { hasToken } = useSession()
  const { data: user, isFetching: fetchingUser } = useErrorlessQuery<User>(
    {
      queryKey: userId ? ['public', 'user', 'users', userId] : ['private', 'user', 'me'],
      enabled: userId != undefined || hasToken,
    },
    '获取用户信息',
  )

  return {
    user,
    fetchingUser,

    isAdmin: user?.role_id === 2,
    isAnonymous: user?.is_anon ?? true,
  }
}

const checkLoggedIn = () =>
  !!localStorage.getItem('token') &&
  !jwt_decode<JwtUserData>(localStorage.getItem('token')!).is_anon

export function useSession() {
  const { data: loggedIn } = useQuery<boolean>(['state', 'loggedIn'], checkLoggedIn, {
    initialData: checkLoggedIn,
  })
  const { data: anonymousToken } = useErrorlessQuery<string>(
    {
      queryKey: ['public', 'user', 'login', 'anon'],
      staleTime: Infinity,
      cacheTime: Infinity,
    },
    '获取匿名登录令牌',
  )

  useEffect(() => {
    if (!loggedIn && anonymousToken) {
      localStorage.setItem('token', anonymousToken)
    }
  }, [loggedIn, anonymousToken])

  const { mutateAsync: logIn, isLoading: loggingIn } = usePost<string, LoginForm>(
    ['public', 'user', 'login'],
    '登录',
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data)
        queryClient.invalidateQueries(['state', 'loggedIn'])
        queryClient.invalidateQueries(['private'])
      },
    },
  )
  const { mutateAsync: registerUser, isLoading: registering } = usePost<User, UserCreatingForm>(
    ['public', 'user', 'register'],
    '注册用户',
  )

  const logOut = useCallback(() => {
    localStorage.setItem('token', anonymousToken ?? '')
    queryClient.invalidateQueries(['state', 'loggedIn'])
    queryClient.invalidateQueries(['private'])
  }, [anonymousToken])

  return {
    loggedIn,
    hasToken: loggedIn || !!anonymousToken,
    logIn,
    loggingIn,
    registerUser,
    registering,
    logOut,
  }
}
