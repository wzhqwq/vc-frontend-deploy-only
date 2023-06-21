import { useQuery } from '@tanstack/react-query'
import { usePatch, usePost } from './common'
import { queryClient } from './queryClient'
import { useCallback } from 'react'

export interface User {
  id: number
  username: string
  email: string
  createdAt: number
  lastLoginAt: number
  role: number
}
export interface UserCreatingForm {
  email: string
  password: string
}
export type UserForm = Partial<UserCreatingForm>
export type LoginForm = UserCreatingForm

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

export function useSession() {
  const { data: loggedIn } = useQuery<boolean>(
    ['state', 'loggedIn'],
    () => localStorage.getItem('token') !== null,
    {
      initialData: () => localStorage.getItem('token') !== null,
    },
  )
  const { mutateAsync: logIn } = usePost<string, LoginForm>(['public', 'user', 'login'], {
    onSuccess: (data) => {
      localStorage.setItem('token', data)
      queryClient.invalidateQueries(['state', 'loggedIn'])
    },
  })
  const { mutateAsync: registerUser } = usePost<User, UserCreatingForm>(['public', 'user', 'register'])

  const logOut = useCallback(() => {
    localStorage.removeItem('token')
    queryClient.invalidateQueries(['state', 'loggedIn'])
    queryClient.removeQueries(['private'])
  }, [])

  return {
    loggedIn,
    logIn,
    registerUser,
    logOut,
  }
}
