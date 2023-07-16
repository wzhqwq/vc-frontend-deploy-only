import { Suspense, lazy } from 'react'
import { LinePlotProps, ScatterPlotProps } from './Diagrams'
import { CircularProgress } from '@mui/joy'

const LazyLinePlot = lazy(() => import('./Diagrams').then((m) => ({ default: m.LinePlot })))
export const LinePlot = (props: LinePlotProps) => (
  <Suspense fallback={<CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}>
    <LazyLinePlot {...props} />
  </Suspense>
)
const LazyScatterPlot = lazy(() => import('./Diagrams').then((m) => ({ default: m.ScatterPlot })))
export const ScatterPlot = (props: ScatterPlotProps) => (
  <Suspense fallback={<CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}>
    <LazyScatterPlot {...props} />
  </Suspense>
)
// const LazyRidgeLinePlot = lazy(() => import('./Diagrams').then((m) => ({ default: m.RidgeLinePlot })))
// export const RidgeLinePlot = (props: RidgeLinePlotProps) => (
//   <Suspense fallback={<CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}>
//     <LazyRidgeLinePlot {...props} />
//   </Suspense>
// )
