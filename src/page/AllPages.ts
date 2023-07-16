import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'

import MainFrame from './MainFrame'

import Login from './user/Login'
import Register from './user/Register'

import Welcome from './index/Welcome'
import PublicTasks from './index/PublicTasks'
import ExploreFrame from './index/ExploreFrame'
import Guide from './index/Guide'
import About from './index/About'

import NewProject from './project/NewProject'
import ViewProject from './project/ViewProject'
import EditProject from './project/EditProject'

import ViewTask from './task/ViewTask'

import NewModel from './model/NewModel'
import ViewModel from './model/ViewModel'
import EditModel from './model/EditModel'

import NewDataset from './dataset/NewDataset'
import ViewDataset from './dataset/ViewDataset'
import EditDataset from './dataset/EditDataset'

import OwnProperty from './user/OwnProperty'
import OwnTasks from './user/OwnTasks'
import Notifications from './user/Notifications'
import NotificationDetail from './user/NotificationDetail'

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

export const newModel = {
  Component: NewModel,
  ErrorBoundary: SimpleErrorBoundary,
}
export const viewModel = {
  Component: ViewModel,
  ErrorBoundary: SimpleErrorBoundary,
}
export const editModel = {
  Component: EditModel,
  ErrorBoundary: SimpleErrorBoundary,
}

export const newDataset = {
  Component: NewDataset,
  ErrorBoundary: SimpleErrorBoundary,
}
export const viewDataset = {
  Component: ViewDataset,
  ErrorBoundary: SimpleErrorBoundary,
}
export const editDataset = {
  Component: EditDataset,
  ErrorBoundary: SimpleErrorBoundary,
}

export const ownProperty = {
  Component: OwnProperty,
  ErrorBoundary: SimpleErrorBoundary,
}
export const ownTasks = {
  Component: OwnTasks,
  ErrorBoundary: SimpleErrorBoundary,
}
export const notifications = {
  Component: Notifications,
  ErrorBoundary: SimpleErrorBoundary,
}
export const notificationDetail = {
  Component: NotificationDetail,
  ErrorBoundary: SimpleErrorBoundary,
}
