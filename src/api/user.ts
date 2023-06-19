import { useQuery } from '@tanstack/react-query'
import { Link, usePatch, usePost } from './common'
import { queryClient } from './queryClient'
import { useCallback } from 'react'

export interface User {
  id: number
  username: string
  email: string
  createdAt: number
  lastLoginAt: number
  role: number
  _links: Link[]
}
export interface UserForm {
  password?: string
  email?: string
}

export function useUser() {
  const { loggedIn } = useSession()
  const { data: user, isFetching: fetchingUser } = useQuery<User>(['private', 'users', 'me'], {
    enabled: loggedIn,
  })
  const { isLoading: updatingUser, mutate: updateUser } = usePatch<User, UserForm>(
    ['private', 'users', 'me'],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'users', 'me'])
      },
    },
  )

  return {
    user,
    fetchingUser,
    updateUser,
    updatingUser,
    isAdmin: user?.role === 2,
  }
}

export interface LoginForm {
  username: string
  password: string
}
export interface RegisterForm extends LoginForm {
  email: string
}
export function useSession() {
  const { data: loggedIn } = useQuery<boolean>(
    ['state', 'loggedIn'],
    () => localStorage.getItem('token') !== null,
    {
      initialData: () => localStorage.getItem('token') !== null,
    },
  )
  const { mutate: logIn, isLoading: loggingIn } = usePost<string, LoginForm>(
    ['public', 'users', 'session'],
    {
      onSuccess: (data) => {
        localStorage.setItem('token', data)
        queryClient.invalidateQueries(['state', 'loggedIn'])
      },
    },
  )
  const {
    mutateAsync: register,
    isLoading: registering,
  } = usePost<User, RegisterForm>(['public', 'users', 'new'])

  const logOut = useCallback(() => {
    localStorage.removeItem('token')
    queryClient.invalidateQueries(['state', 'loggedIn'])
    queryClient.removeQueries(['private'])
  }, [])

  return {
    loggedIn,
    logIn,
    loggingIn,
    register,
    registering,
    logOut,
  }
}
