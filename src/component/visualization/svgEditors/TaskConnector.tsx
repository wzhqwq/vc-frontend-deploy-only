import { useTaskConnecting } from '@/component/context/TaskConnectingContext'
import { ProjectGraph } from '@/types/config/project'
import { Box } from '@mui/joy'
import { memo, useEffect } from 'react'
import { useController, useWatch } from 'react-hook-form'

interface ConnectingPointProps {
  connected: boolean
  connecting: boolean
  onClick: () => void
  id: string
}
const ConnectingPoint = memo(function ConnectingPoint({
  connected,
  connecting,
  onClick,
  id,
}: ConnectingPointProps) {
  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.vars.palette.primary[connected ? 500 : connecting ? 50 : 300],
        border: '2px solid',
        borderColor: theme.vars.palette.primary[connected || connecting ? 500 : 300],
        width: 12,
        height: 12,
        m: -1,
        borderRadius: 8,
        zIndex: 100,
      })}
      onClick={onClick}
      id={id}
    />
  )
})

export interface TaskConnectorProps {
  name: `${keyof ProjectGraph}.${number}`
  index: number
}
export function TaskInputConnector({ name, index }: TaskConnectorProps) {
  const id = useWatch<ProjectGraph>({ name: `${name}.id` })
  const {
    field: { value, onChange },
  } = useController<ProjectGraph>({ name: `${name}.inPeers.${index}`, defaultValue: '' })
  const self = `${id}.${index}`
  const {
    outputToConnect,
    selfConnecting,
    paired,
    toggleSelf,
    resetPair,
    addPair,
    removePair,
    connected,
  } = useTaskConnecting(self, 'input')

  useEffect(() => {
    if (value) addPair(self, value)
    else removePair(self)
  }, [value])

  useEffect(() => {
    if (paired) {
      if (!selfConnecting) return
      resetPair()
      if (outputToConnect == id) return
      onChange(outputToConnect)
    }
  }, [paired])

  return (
    <ConnectingPoint
      connected={connected}
      connecting={selfConnecting}
      onClick={() => {
        if (value) {
          onChange('')
          return
        }
        toggleSelf()
      }}
      id={`tc-${self}`}
    />
  )
}
export function TaskOutputConnector({ name }: TaskConnectorProps) {
  const id = useWatch<ProjectGraph>({ name: `${name}.id` })
  const { connected, selfConnecting, toggleSelf } = useTaskConnecting(id, 'output')

  return (
    <ConnectingPoint
      connected={connected}
      connecting={selfConnecting}
      onClick={() => !connected && toggleSelf()}
      id={`tc-${id}`}
    />
  )
}
