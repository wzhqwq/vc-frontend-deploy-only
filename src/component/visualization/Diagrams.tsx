import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

const MARGIN_X = 50
const MARGIN_Y = 30

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
  data: number[]
  xLabel: string
  yLabel: string
  width?: number
  height?: number
}
interface LinePlotController {
  svg: SVGElement
  doUpdate: (data: number[]) => void
}
function generateLinePlot(
  xLabel: string,
  yLabel: string,
  width: number,
  height: number,
): LinePlotController {
  const svg = getSvg(width, height)
  const [xGroup, yGroup] = getAxisGroup(svg, xLabel, yLabel, width, height)

  const path = svg
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)

  const doUpdate = (data: number[]) => {
    const x = d3.scaleLinear([0, data.length], [MARGIN_X, width - MARGIN_X])
    const y = d3.scaleLinear([0, Math.max(...data)], [height - MARGIN_Y, MARGIN_Y])
    updateXAxis(xGroup, x)
    updateYAxis(yGroup, y)
    const line = d3.line<number>(
      (_, i) => x(i),
      (d) => y(d),
    )
    path.transition().duration(300).attr('d', line(data))
  }

  return {
    svg: svg.node()!,
    doUpdate,
  }
}
export function LinePlot({ data, xLabel, yLabel, width = 500, height = 400 }: LinePlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const components = useRef<LinePlotController>()
  useEffect(() => {
    if (ref.current) {
      components.current = generateLinePlot(xLabel, yLabel, width, height)
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
