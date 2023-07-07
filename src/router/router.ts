import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/page/NormalPages').then((m) => m.mainFrame),
    children: [
      { index: true, lazy: () => import('@/page/NormalPages').then((m) => m.welcome) },
      { path: 'login', lazy: () => import('@/page/NormalPages').then((m) => m.login) },
      { path: 'register', lazy: () => import('@/page/NormalPages').then((m) => m.register) },
      { path: 'tasks', lazy: () => import('@/page/NormalPages').then((m) => m.tasks) },
      {
        path: 'workspace',
        children: [
          { path: 'dl-editor/:id', lazy: () => import('@/page/SVGPages').then((m) => m.dlEditor) },
        ],
      },
      {
        path: 'explore/:type',
        lazy: () => import('@/page/NormalPages').then((m) => m.exploreFrame),
      },
    ],
  },
])
