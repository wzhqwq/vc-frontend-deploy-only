import { joyTheme } from '@/theme'
import * as d3 from 'd3'
import { useEffect, useMemo, useRef } from 'react'

const MARGIN_X = 50
const MARGIN_Y = 30

const LINE_COLORS = [
  joyTheme.vars.palette.neutral[500],
  joyTheme.vars.palette.primary[400],
  joyTheme.vars.palette.danger[400],
  joyTheme.vars.palette.warning[300],
]
const FILL_COLORS = [
  joyTheme.vars.palette.neutral[100],
  joyTheme.vars.palette.primary[100],
  joyTheme.vars.palette.danger[100],
  joyTheme.vars.palette.warning[100],
]

type SvgSelection = d3.Selection<SVGSVGElement, undefined, null, undefined>
type GroupSelection = d3.Selection<SVGGElement, undefined, null, undefined>
const getSvg = (width: number, height: number) =>
  d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
const getAxisGroup = (
  svg: SvgSelection,
  xLabel: string,
  yLabel: string,
  width: number,
  height: number,
) => [
  svg
    .append('g')
    .attr('transform', `translate(0,${height - MARGIN_Y})`)
    .call((g) =>
      g
        .append('text')
        .attr('x', width - MARGIN_X + 10)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text(xLabel),
    ),
  svg
    .append('g')
    .attr('transform', `translate(${MARGIN_X},0)`)
    .call((g) =>
      g
        .append('text')
        .attr('y', MARGIN_Y - 10)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text(yLabel),
    ),
]
const updateXAxis = (group: GroupSelection, x: d3.AxisScale<d3.NumberValue>, label?: string) => {
  const xAxis = d3.axisBottom(x).tickSizeOuter(0)
  group.transition().duration(300).call(xAxis)
  if (label) group.select('text').text(label)
}
const updateYAxis = (group: GroupSelection, y: d3.AxisScale<d3.NumberValue>, label?: string) => {
  const yAxis = d3.axisLeft(y)
  group.transition().duration(300).call(yAxis)
  if (label) group.select('text').text(label)
}

interface LinePlotController {
  svg: SVGElement
  doUpdate: (data: number[][], xLabel: string, yLabel: string) => void
}
function generateLinePlot(count: number, width: number, height: number): LinePlotController {
  const svg = getSvg(width, height)
  const [xGroup, yGroup] = getAxisGroup(svg, '', '', width, height)

  const paths = new Array(count).fill(0).map((_, i) =>
    svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', LINE_COLORS[i % LINE_COLORS.length])
      .attr('stroke-width', 2),
  )

  const doUpdate = (data: number[][], xLabel: string, yLabel: string) => {
    const x = d3.scaleLinear([1, data[0].length], [MARGIN_X, width - MARGIN_X])
    const y = d3.scaleLinear([0, Math.max(...data.flat())], [height - MARGIN_Y, MARGIN_Y])
    updateXAxis(xGroup, x, xLabel)
    updateYAxis(yGroup, y, yLabel)
    const line = d3.line<number>(
      (_, i) => x(i + 1),
      (d) => y(d),
    )
    paths.forEach((path, i) => path.transition().duration(300).attr('d', line(data[i])))
  }

  return {
    svg: svg.node()!,
    doUpdate,
  }
}

export interface LinePlotProps {
  data: number[][]
  xLabel: string
  yLabel: string
  width?: number
  height?: number
}
export function LinePlot({ data, xLabel, yLabel, width = 500, height = 400 }: LinePlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const components = useRef<LinePlotController>()
  useEffect(() => {
    if (ref.current) {
      components.current = generateLinePlot(data.length, width, height)
      ref.current.appendChild(components.current.svg)
      return () => {
        ref.current?.removeChild(components.current!.svg)
        console.log('remove')
      }
    }
  }, [width, height, data.length])
  useEffect(() => {
    components.current?.doUpdate(data, xLabel, yLabel)
  }, [data, xLabel, yLabel])

  return <div ref={ref} />
}

interface RidgeLinePlotController {
  svg: SVGElement
  doUpdate: (data: number[][]) => void
}
function generateRidgeLinePlot(
  xLabel: string,
  yLabel: string,
  width: number,
  height: number,
  overlap: number,
) {
  const svg = getSvg(width, height)
  const [xGroup, yGroup] = getAxisGroup(svg, xLabel, yLabel, width, height)
}

interface ScatterPlotController {
  svg: SVGElement
  doUpdate: (data: [number, number][], label: number[]) => void
}
function generateScatterPlot(
  xLabel: string,
  yLabel: string,
  width: number,
  height: number,
  kinds: number,
): ScatterPlotController {
  const svg = getSvg(width, height)
  const [xGroup, yGroup] = getAxisGroup(svg, xLabel, yLabel, width, height)

  const dots = new Array(kinds).fill(0).map((_, i) =>
    svg
      .append('g')
      .attr('fill', LINE_COLORS[i % LINE_COLORS.length])
      .attr('stroke', 'none'),
  )

  const doUpdate = (data: [number, number][], label: number[]) => {
    const xs = data.map((d) => d[0])
    const ys = data.map((d) => d[1])
    const x = d3.scaleLinear([Math.min(...xs), Math.max(...xs)], [MARGIN_X, width - MARGIN_X])
    const y = d3.scaleLinear([Math.min(...ys), Math.max(...ys)], [height - MARGIN_Y, MARGIN_Y])
    updateXAxis(xGroup, x)
    updateYAxis(yGroup, y)
    for (let k = 0; k < kinds; k++) {
      dots[k].selectAll('circle').remove()
      dots[k]
        .selectAll('circle')
        .data(data.filter((_, i) => label[i] === k + 1))
        .join('circle')
        .attr('cx', (d) => x(d[0]))
        .attr('cy', (d) => y(d[1]))
        .attr('r', 2)
    }
  }

  return {
    svg: svg.node()!,
    doUpdate,
  }
}

export interface ScatterPlotProps {
  data: [number, number][]
  label: number[]
  xLabel: string
  yLabel: string
  width?: number
  height?: number
}
export function ScatterPlot({
  data,
  label,
  xLabel,
  yLabel,
  width = 500,
  height = 400,
}: ScatterPlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const components = useRef<ScatterPlotController>()
  const kinds = useMemo(() => Math.max(...label), [label])
  useEffect(() => {
    if (ref.current) {
      components.current = generateScatterPlot(xLabel, yLabel, width, height, kinds)
      ref.current.appendChild(components.current.svg)
      return () => {
        ref.current?.removeChild(components.current!.svg)
      }
    }
  }, [xLabel, yLabel, width, height, kinds])
  useEffect(() => {
    components.current?.doUpdate(data, label)
  }, [data, label])

  return <div ref={ref} />
}
