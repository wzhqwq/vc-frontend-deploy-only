import { toUrl } from '@/api/files'
import { ScatterPlot } from '@/component/large/Diagrams'
import { LinePlot } from '@/component/large/lazyDiagrams'
import {
  AllAnalysisType,
  EachAnalysisResult,
  HeatMapResult,
  LineChartResult,
  ScatterPlotResult,
} from '@/types/config/details/tasks'
import { Box, Option, Select, Stack, Tab, TabList, Tabs, Typography } from '@mui/joy'
import { useEffect, useMemo, useState } from 'react'

export interface VisualizationProps {
  data: EachAnalysisResult
  type: AllAnalysisType
  multiTask: boolean
}
export default function Visualization({ data, type, multiTask }: VisualizationProps) {
  switch (type) {
    case 'line_chart':
      return <LinePlotVisualization data={data as LineChartResult} multiTask={multiTask} />
    case 'scatter_plot':
      return <ScatterPlotVisualization data={data as ScatterPlotResult} />
    case 'heat_map':
      return <HeatMapVisualization data={data as HeatMapResult} />
  }
}

function LinePlotVisualization({ data, multiTask }: { data: LineChartResult; multiTask: boolean }) {
  const indexes = useMemo(() => Object.keys(data), [data])
  const [index, setIndex] = useState('')
  useEffect(() => {
    setIndex(indexes[0])
  }, [indexes])

  return (
    <Box p={2}>
      <Tabs value={index} onChange={(_, v) => setIndex(v as string)}>
        <TabList>
          {indexes.map((index) => (
            <Tab key={index} value={index}>
              {index}
            </Tab>
          ))}
        </TabList>
        {data[index] && (
          <LinePlot
            data={data[index]}
            xLabel='Epoch'
            yLabel={index}
            width={600}
            height={500}
          />
        )}
      </Tabs>
    </Box>
  )
}

function ScatterPlotVisualization({ data }: { data: ScatterPlotResult }) {
  const classes = useMemo(() => data.label[0].length, [data])
  const [classNum, setClassNum] = useState(0)
  const label = useMemo(() => data.label.map((l) => l[classNum]), [data, classNum])

  return (
    <Box p={2}>
      <Tabs value={classNum} onChange={(_, v) => setClassNum(v as number)}>
        <TabList>
          {new Array(classes).fill(0).map((_, i) => (
            <Tab key={i} value={i}>
              {i + 1}
            </Tab>
          ))}
        </TabList>
        <ScatterPlot data={data.x_y} label={label} xLabel="x" yLabel="y" width={600} height={600} />
      </Tabs>
    </Box>
  )
}

function HeatMapVisualization({ data }: { data: HeatMapResult }) {
  const [dim, setDim] = useState(0)

  return (
    <Box p={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>查看维度</Typography>
        <Select value={dim} onChange={(_, v) => setDim(v as number)}>
          {data.map((_, i) => (
            <Option key={i} value={i}>
              {i + 1}
            </Option>
          ))}
        </Select>
      </Stack>
      <Box component="img" src={toUrl(data[dim])} />
    </Box>
  )
}
