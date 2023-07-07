import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'

import MainFrame from './MainFrame'

import Login from './user/Login'
import Register from './user/Register'

import Welcome from './index/Welcome'
import Tasks from './index/Tasks'

export const mainFrame = {
  Component: MainFrame,
  ErrorBoundary: SimpleErrorBoundary,
}
export const login = {
  Component: Login,
  ErrorBoundary: SimpleErrorBoundary,
}
export const register = {
  Component: Register,
  ErrorBoundary: SimpleErrorBoundary,
}
export const welcome = {
  Component: Welcome,
  ErrorBoundary: SimpleErrorBoundary,
}
export const tasks = {
  Component: Tasks,
  ErrorBoundary: SimpleErrorBoundary,
}
