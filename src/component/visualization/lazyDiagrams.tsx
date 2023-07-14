import { lazy } from 'react'

export const LinePlot = lazy(() =>
  import('./Diagrams').then((m) => ({ default: m.LinePlot })),
)
