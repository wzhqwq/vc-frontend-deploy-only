import { joyTheme } from '@/theme'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

const MARGIN_X = 50
const MARGIN_Y = 30

const LINE_COLOR_1 = joyTheme.vars.palette.primary[500]
const LINE_COLOR_1_LIGHT = joyTheme.vars.palette.primary[100]
const LINE_COLOR_2 = joyTheme.vars.palette.primary[300]

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
        .attr('text-anchor', 'end')
        .text(yLabel),
    ),
]
const updateXAxis = (group: GroupSelection, x: d3.AxisScale<d3.NumberValue>) => {
  const xAxis = d3.axisBottom(x).tickSizeOuter(0)
  group.transition().duration(300).call(xAxis)
}
const updateYAxis = (group: GroupSelection, y: d3.AxisScale<d3.NumberValue>) => {
  const yAxis = d3.axisLeft(y)
  group.transition().duration(300).call(yAxis)
}

export interface LinePlotProps {
  data: [number[], number[]]
  xLabel: string
  yLabel: string
  width?: number
  height?: number
}
interface DoubleLinePlotController {
  svg: SVGElement
  doUpdate: (data: [number[], number[]]) => void
}
function generateDoubleLinePlot(
  xLabel: string,
  yLabel: string,
  width: number,
  height: number,
): DoubleLinePlotController {
  const svg = getSvg(width, height)
  const [xGroup, yGroup] = getAxisGroup(svg, xLabel, yLabel, width, height)

  const path1 = svg
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', LINE_COLOR_1)
    .attr('stroke-width', 2)
  const path2 = svg
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', LINE_COLOR_2)
    .attr('stroke-width', 2)

  const doUpdate = (data: [number[], number[]]) => {
    const x = d3.scaleLinear([0, data.length], [MARGIN_X, width - MARGIN_X])
    const y = d3.scaleLinear([0, Math.max(...data.flat())], [height - MARGIN_Y, MARGIN_Y])
    updateXAxis(xGroup, x)
    updateYAxis(yGroup, y)
    const line = d3.line<number>(
      (_, i) => x(i),
      (d) => y(d),
    )
    path1.transition().duration(300).attr('d', line(data[0]))
    path2.transition().duration(300).attr('d', line(data[1]))
  }

  return {
    svg: svg.node()!,
    doUpdate,
  }
}
export function LinePlot({ data, xLabel, yLabel, width = 500, height = 400 }: LinePlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const components = useRef<DoubleLinePlotController>()
  useEffect(() => {
    if (ref.current) {
      components.current = generateDoubleLinePlot(xLabel, yLabel, width, height)
      ref.current.appendChild(components.current.svg)
      return () => {
        ref.current?.removeChild(components.current!.svg)
      }
    }
  }, [xLabel, yLabel, width, height])
  useEffect(() => {
    components.current?.doUpdate(data)
  }, [data])

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