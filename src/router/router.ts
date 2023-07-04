import { createBrowserRouter } from 'react-router-dom'

import MainFrame from '@/page/MainFrame'
import Welcome from '@/page/Welcome'
import Login from '@/page/user/Login'
import Register from '@/page/user/Register'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainFrame,
    children: [
      { index: true, Component: Welcome },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'workspace', children: [
        { path: 'dl-editor', lazy: () => import('@/page/workspace/DLEditor') },
      ]}
    ],
  },
])
