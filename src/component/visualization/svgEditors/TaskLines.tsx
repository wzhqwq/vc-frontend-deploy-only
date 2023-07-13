import { useTaskPairs } from '@/component/context/TaskConnectingContext'
import { joyTheme } from '@/theme'
import { Box } from '@mui/joy'
import { SVG, Svg } from '@svgdotjs/svg.js'
import { useCallback, useEffect, useRef } from 'react'

const lineStroke = { color: joyTheme.vars.palette.primary[500], width: 2 }

export default function TaskLines() {
  const pairs = useTaskPairs()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<Svg | null>(null)
  const pairsRef = useRef(pairs)

  const updateLines = useCallback(() => {
    if (!svgRef.current) return
    svgRef.current.clear()
    const { x: offsetX, y: offsetY } = containerRef.current!.getBoundingClientRect()
    pairsRef.current.forEach(({ input, output }) => {
      const inputEl = document.getElementById(`tc-${input}`)
      const outputEl = document.getElementById(`tc-${output}`)
      if (!inputEl || !outputEl) return
      const inputRect = inputEl.getBoundingClientRect()
      const outputRect = outputEl.getBoundingClientRect()
      const inputX = inputRect.x - offsetX + inputRect.width / 2
      const inputY = inputRect.y - offsetY + inputRect.height / 2
      const outputX = outputRect.x - offsetX + outputRect.width / 2
      const outputY = outputRect.y - offsetY + outputRect.height / 2
      svgRef.current!.line(inputX, inputY, outputX, outputY).stroke(lineStroke)
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const svg = SVG().addTo(containerRef.current)
    svgRef.current = svg
    return () => {
      svg.remove()
      svgRef.current = null
    }
  }, [])
  useEffect(() => {
    pairsRef.current = pairs
    updateLines()
  }, [pairs])
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      svgRef.current!.size(width, height)
      updateLines()
    })
    resizeObserver.observe(containerRef.current!)
    return () => resizeObserver.disconnect()
  }, [])

  return <Box sx={{ position: 'absolute', width: '100%', height: '100%' }} ref={containerRef} />
}
