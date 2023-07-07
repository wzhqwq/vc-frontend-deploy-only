import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'

import MainFrame from './MainFrame'

import Login from './user/Login'
import Register from './user/Register'

import Welcome from './index/Welcome'
import PublicTasks from './index/PublicTasks'
import ExploreFrame from './explore/ExploreFrame'
import Guide from './index/Guide'
import About from './index/About'

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

export const publicTasks = {
  Component: PublicTasks,
  ErrorBoundary: SimpleErrorBoundary,
}
export const exploreFrame = {
  Component: ExploreFrame,
  ErrorBoundary: SimpleErrorBoundary,
}
export const guide = {
  Component: Guide,
  ErrorBoundary: SimpleErrorBoundary,
}
export const about = {
  Component: About,
  ErrorBoundary: SimpleErrorBoundary,
}
