import { lazy } from 'react'

export const LayerGraphEditor = lazy(() =>
  import('./svgEditors').then((m) => ({ default: m.LayerGraphEditor })),
)
export const ProjectGraphEditor = lazy(() =>
  import('./svgEditors').then((m) => ({ default: m.ProjectGraphEditor })),
)
