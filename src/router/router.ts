import { createBrowserRouter } from 'react-router-dom'

import { MainFrame } from '@/page/MainFrame'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainFrame,
    children: [
    ],
  },
])
