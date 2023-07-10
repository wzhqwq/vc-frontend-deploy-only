import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'

import MainFrame from './MainFrame'

import Login from './user/Login'
import Register from './user/Register'

import Welcome from './index/Welcome'
import PublicTasks from './index/PublicTasks'
import ExploreFrame from './explore/ExploreFrame'
import Guide from './index/Guide'
import About from './index/About'

import NewProject from './project/NewProject'
import ViewProject from './project/ViewProject'
import EditProject from './project/EditProject'
import ViewTask from './task/ViewTask'

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

export const newProject = {
  Component: NewProject,
  ErrorBoundary: SimpleErrorBoundary,
}
export const viewProject = {
  Component: ViewProject,
  ErrorBoundary: SimpleErrorBoundary,
}
export const editProject = {
  Component: EditProject,
  ErrorBoundary: SimpleErrorBoundary,
}

export const viewTask = {
  Component: ViewTask,
  ErrorBoundary: SimpleErrorBoundary,
}