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
export type JwtUserData = Omit<User, 'email'>

export function useUser() {
  const { loggedIn } = useSession()
  const { data: user, isFetching: fetchingUser } = useErrorlessQuery<User>({
    queryKey: ['private', 'user', 'me'],
    enabled: loggedIn,
  })
  // const { isLoading: updatingUser, mutate: updateUser } = usePatch<User, UserForm>(
  //   ['private', 'user', 'me'],
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(['private', 'user', 'me'])
  //     },
  //   },
  // )

  return {
    user,
    fetchingUser,
    // updateUser,
    // updatingUser,
    isAdmin: user?.role_id === 2,
  }
}

const checkLoggedIn = () =>
  !!localStorage.getItem('token') &&
  !jwt_decode<JwtUserData>(localStorage.getItem('token')!).is_anon

export function useSession() {
  const { data: loggedIn } = useQuery<boolean>(['state', 'loggedIn'], checkLoggedIn, {
    initialData: checkLoggedIn,
  })
  const { data: anonymousToken } = useErrorlessQuery<string>({
    queryKey: ['public', 'user', 'login', 'anon'],
    enabled: !loggedIn,
  })

  useEffect(() => {
    if (!loggedIn && anonymousToken) {
      localStorage.setItem('token', anonymousToken)
    }
  }, [loggedIn, anonymousToken])

  const { mutateAsync: logIn, isLoading: loggingIn } = usePost<string, LoginForm>(
    ['public', 'user', 'login'],
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data)
        queryClient.invalidateQueries(['state', 'loggedIn'])
      },
    },
  )
  const { mutateAsync: registerUser, isLoading: registering } = usePost<User, UserCreatingForm>([
    'public',
    'user',
    'register',
  ])

  const logOut = useCallback(() => {
    localStorage.removeItem('token')
    queryClient.invalidateQueries(['state', 'loggedIn'])
    queryClient.removeQueries(['private'])
  }, [])

  return {
    loggedIn,
    logIn,
    loggingIn,
    registerUser,
    registering,
    logOut,
  }
}
