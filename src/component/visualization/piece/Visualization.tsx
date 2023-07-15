import { LinePlot } from "@/component/large/lazyDiagrams";
import { AllAnalysisType, EachAnalysisResult, LineChartResult } from "@/types/config/details/tasks";
import { Box, Stack } from "@mui/joy";
import { useMemo } from "react";

export interface VisualizationProps {
  data: EachAnalysisResult
  type: AllAnalysisType
  multiTask: boolean
}
export default function Visualization({ data, type, multiTask }: VisualizationProps) {
  switch (type) {
    case 'line_chart':
      return <LinePlotVisualization data={data as LineChartResult} multiTask={multiTask} />
    default:
      return <Box>Unknown type: {type}</Box>
  }
}

function LinePlotVisualization({ data, multiTask }: { data: LineChartResult, multiTask: boolean }) {
  const indexes = useMemo(() => Object.entries(data), [data])
  const plots = useMemo(() => multiTask ? indexes.map(([index, data]) => (
    <LinePlot
      key={index}
      data={data}
      xLabel='epoch'
      yLabel={index}
      />
  )) : indexes.map(([index, data]) => (
    <LinePlot
      key={index}
      data={data}
      xLabel='epoch'
      yLabel={index}
      />
  )), [data, multiTask])

  return (
    <Stack spacing={2}>
      {plots}
    </Stack>
  )
}