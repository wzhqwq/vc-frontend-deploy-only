import { createBrowserRouter } from 'react-router-dom'

import { MainFrame } from '@/page/MainFrame'
import { Welcome } from '@/page/Welcome'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainFrame,
    children: [
      { index: true, Component: Welcome },
    ],
  },
])
