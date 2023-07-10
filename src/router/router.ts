import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/page/AllPages').then((m) => m.mainFrame),
    children: [
      { index: true, lazy: () => import('@/page/AllPages').then((m) => m.welcome) },
      { path: 'login', lazy: () => import('@/page/AllPages').then((m) => m.login) },
      { path: 'register', lazy: () => import('@/page/AllPages').then((m) => m.register) },
      { path: 'tasks', lazy: () => import('@/page/AllPages').then((m) => m.publicTasks) },
      {
        path: 'explore/:type',
        lazy: () => import('@/page/AllPages').then((m) => m.exploreFrame),
      },
      { path: 'guide', lazy: () => import('@/page/AllPages').then((m) => m.guide) },
      { path: 'about', lazy: () => import('@/page/AllPages').then((m) => m.about) },
      {
        path: 'project',
        children: [
          { path: ':id', lazy: () => import('@/page/AllPages').then((m) => m.viewProject) },
          { path: ':id/edit', lazy: () => import('@/page/AllPages').then((m) => m.editProject) },
          { path: 'new', lazy: () => import('@/page/AllPages').then((m) => m.newProject) },
        ],
      },
      { path: 'task/:id', lazy: () => import('@/page/AllPages').then((m) => m.viewTask) },
    ],
  },
])
