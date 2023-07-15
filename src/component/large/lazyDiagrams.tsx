import { Suspense, lazy } from 'react'
import { LinePlotProps } from './Diagrams'
import { CircularProgress } from '@mui/joy'

const LazyLinePlot = lazy(() => import('./Diagrams').then((m) => ({ default: m.LinePlot })))
export const LinePlot = (props: LinePlotProps) => (
  <Suspense fallback={<CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}>
    <LazyLinePlot {...props} />
  </Suspense>
)
