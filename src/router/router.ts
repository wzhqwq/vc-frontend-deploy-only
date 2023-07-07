import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/page/NormalPages').then((m) => m.mainFrame),
    children: [
      { index: true, lazy: () => import('@/page/NormalPages').then((m) => m.welcome) },
      { path: 'login', lazy: () => import('@/page/NormalPages').then((m) => m.login) },
      { path: 'register', lazy: () => import('@/page/NormalPages').then((m) => m.register) },
      { path: 'tasks', lazy: () => import('@/page/NormalPages').then((m) => m.publicTasks) },
      {
        path: 'explore/:type',
        lazy: () => import('@/page/NormalPages').then((m) => m.exploreFrame),
      },
      { path: 'guide', lazy: () => import('@/page/NormalPages').then((m) => m.guide) },
      { path: 'about', lazy: () => import('@/page/NormalPages').then((m) => m.about) },
      // { path: 'project/:id' },
      // { path: 'task/:id' },
    ],
  },
])
