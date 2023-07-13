import { joyTheme } from '@/theme'
import { Box } from '@mui/joy'
import { SVG, Svg } from '@svgdotjs/svg.js'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export const TaskConnectingContext = createContext<{
  inputToConnect: string | null
  outputToConnect: string | null
  pairs: { input: string; output: string }[]
  resizeObserver: ResizeObserver | null
  setInputToConnect: Dispatch<SetStateAction<string | null>>
  setOutputToConnect: Dispatch<SetStateAction<string | null>>
  setPairs: Dispatch<SetStateAction<{ input: string; output: string }[]>>
  reset: () => void
}>({
  inputToConnect: null,
  outputToConnect: null,
  pairs: [],
  resizeObserver: null,
  setInputToConnect: () => {},
  setOutputToConnect: () => {},
  setPairs: () => {},
  reset: () => {},
})

const lineStroke = { color: joyTheme.vars.palette.primary[500], width: 2, linecap: 'round' }

export function TaskConnectingContextProvider({ children }: { children: ReactNode }) {
  const [inputToConnect, setInputToConnect] = useState<string | null>(null)
  const [outputToConnect, setOutputToConnect] = useState<string | null>(null)
  const [pairs, setPairs] = useState<{ input: string; output: string }[]>([])
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(null)

  const reset = () => {
    setInputToConnect(null)
    setOutputToConnect(null)
  }
  const containerRef = useRef<HTMLDivElement>(null)
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
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.find((e) => e.target === containerRef.current)
      if (entry) {
        const { width, height } = entry.contentRect
        svgRef.current!.size(width, height)
      }
      updateLines()
    })
    resizeObserver.observe(containerRef.current!)
    setResizeObserver(resizeObserver)
    return () => {
      resizeObserver.disconnect()
      setResizeObserver(null)
      svg.remove()
      svgRef.current = null
    }
  }, [])
  useEffect(() => {
    pairsRef.current = pairs
    updateLines()
    console.log(pairs)
  }, [pairs])

  return (
    <TaskConnectingContext.Provider
      value={{
        inputToConnect,
        outputToConnect,
        pairs,
        resizeObserver,
        setInputToConnect,
        setOutputToConnect,
        setPairs,
        reset,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', width: '100%', height: '100%' }} ref={containerRef} />
        {children}
      </Box>
    </TaskConnectingContext.Provider>
  )
}

export function useTaskConnecting(self: string, type: 'input' | 'output') {
  const {
    inputToConnect,
    outputToConnect,
    pairs,
    setInputToConnect,
    setOutputToConnect,
    reset,
    setPairs,
  } = useContext(TaskConnectingContext)

  const selfConnecting = inputToConnect === self || outputToConnect === self
  const paired = selfConnecting && !!(inputToConnect && outputToConnect)
  const connected = useMemo(
    () => pairs.some((p) => p.input === self || p.output === self),
    [pairs, self],
  )
  const toggleSelf = useCallback(() => {
    if (type === 'input') {
      setInputToConnect((i) => (i == self ? null : self))
    } else {
      setOutputToConnect((o) => (o == self ? null : self))
    }
  }, [self, type])
  const addPair = useCallback((input: string, output: string) => {
    setPairs((pairs) => {
      if (pairs.some((p) => p.input === input)) return pairs
      return [...pairs, { input, output }]
    })
  }, [])
  const removePair = useCallback((input: string) => {
    setPairs((pairs) => pairs.filter((p) => p.input !== input))
  }, [])

  return {
    inputToConnect,
    outputToConnect,
    selfConnecting,
    paired,
    connected,
    toggleSelf,
    addPair,
    removePair,
    resetPair: reset,
  }
}

export function useTaskPairs() {
  return useContext(TaskConnectingContext).pairs
}
export function useResizeObserver() {
  return useContext(TaskConnectingContext).resizeObserver
}
