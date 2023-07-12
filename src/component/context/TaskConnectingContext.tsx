import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export const TaskConnectingContext = createContext<{
  inputToConnect: string | null
  outputToConnect: string | null
  pairs: { input: string; output: string }[]
  setInputToConnect: Dispatch<SetStateAction<string | null>>
  setOutputToConnect: Dispatch<SetStateAction<string | null>>
  setPairs: Dispatch<SetStateAction<{ input: string; output: string }[]>>
  reset: () => void
}>({
  inputToConnect: null,
  outputToConnect: null,
  pairs: [],
  setInputToConnect: () => {},
  setOutputToConnect: () => {},
  setPairs: () => {},
  reset: () => {},
})

export function TaskConnectingContextProvider({ children }: { children: ReactNode }) {
  const [inputToConnect, setInputToConnect] = useState<string | null>(null)
  const [outputToConnect, setOutputToConnect] = useState<string | null>(null)
  const [pairs, setPairs] = useState<{ input: string; output: string }[]>([])

  const reset = () => {
    setInputToConnect(null)
    setOutputToConnect(null)
  }

  return (
    <TaskConnectingContext.Provider
      value={{
        inputToConnect,
        outputToConnect,
        pairs,
        setInputToConnect,
        setOutputToConnect,
        setPairs,
        reset,
      }}
    >
      {children}
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
    setPairs(pairs => {
      if (pairs.some(p => p.input === input)) return pairs
      return [...pairs, { input, output }]
    })
  }
  , [])
  const removePair = useCallback((input: string) => {
    setPairs(pairs => pairs.filter(p => p.input !== input))
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
