import { useTaskPairs } from '@/component/context/TaskConnectingContext'
import { joyTheme } from '@/theme'
import { Box } from '@mui/joy'
import { SVG, Svg } from '@svgdotjs/svg.js'
import { useEffect, useRef } from 'react'

const lineStroke = { color: joyTheme.vars.palette.primary[500], width: 2 }

export default function TaskLines() {
  const pairs = useTaskPairs()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<Svg | null>(null)
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
    if (!svgRef.current) return
    svgRef.current.clear()
    const { x: offsetX, y: offsetY } = containerRef.current!.getBoundingClientRect()
    pairs.forEach(({ input, output }) => {
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
  }, [pairs])

  return <Box sx={{ position: 'absolute', width: '100%', height: '100%' }} ref={containerRef} />
}
