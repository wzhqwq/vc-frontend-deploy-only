import { lazy } from 'react'

export const TaskGroupDataGrid = lazy(() =>
  import('./DataGrids').then((m) => ({ default: m.TaskGroupDataGrid })),
)
