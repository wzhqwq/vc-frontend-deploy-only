import { useQuery } from '@tanstack/react-query'
import { usePatch, usePost } from './common'
import { queryClient } from './queryClient'
import { useCallback } from 'react'
import { User } from '@/types/entity/user'

export interface UserCreatingForm {
  email: string
  password: string
  confirmPassword: string
}
export type UserForm = Partial<UserCreatingForm>
export type LoginForm = Omit<UserCreatingForm, 'confirmPassword'>

export function useUser() {
  const { loggedIn } = useSession()
  const { data: user, isFetching: fetchingUser } = useQuery<User>(['private', 'user', 'me'], {
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

export function useSession() {
  const { data: loggedIn } = useQuery<boolean>(
    ['state', 'loggedIn'],
    () => localStorage.getItem('token') !== null,
    {
      initialData: () => localStorage.getItem('token') !== null,
    },
  )
  const { mutateAsync: logIn, isLoading: loggingIn } = usePost<string, LoginForm>(['public', 'user', 'login'], {
    onSuccess: (data) => {
      localStorage.setItem('token', data)
      queryClient.invalidateQueries(['state', 'loggedIn'])
    },
  })
  const { mutateAsync: registerUser, isLoading: registering } = usePost<User, UserCreatingForm>(['public', 'user', 'register'])

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
