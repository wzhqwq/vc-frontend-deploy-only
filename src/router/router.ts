import { Outlet, createBrowserRouter } from 'react-router-dom'

import MainFrame from '@/page/MainFrame'
import Welcome from '@/page/Welcome'
import Login from '@/page/user/Login'
import Register from '@/page/user/Register'
import DLEditor from '@/page/workspace/DLEditor'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainFrame,
    children: [
      { index: true, Component: Welcome },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
    ],
  },
  {
    path: '/workspace',
    Component: Outlet,
    children: [{ path: 'dl-editor', Component: DLEditor }],
  },
])
