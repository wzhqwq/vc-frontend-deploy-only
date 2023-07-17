import { ReadonlyContext } from '@/component/context/ReadonlyContext'
import { useTaskConnecting } from '@/component/context/TaskConnectingContext'
import { joyTheme } from '@/theme'
import { ProjectGraph } from '@/types/config/project'
import { Box } from '@mui/joy'
import { memo, useContext, useEffect } from 'react'
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
  const readonly = useContext(ReadonlyContext)
  return (
    <Box
      sx={{
        bgcolor: joyTheme.vars.palette.primary[connected ? 400 : 50],
        border: '2px solid',
        borderColor: joyTheme.vars.palette.primary[connecting ? 600 : connected ? 400 : 300],
        width: 12,
        height: 12,
        mx: -1,
        my: 1,
        borderRadius: 8,
        zIndex: 100,
      }}
      onClick={() => !readonly && onClick()}
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
  } = useController<ProjectGraph>({
    name: `${name}.inPeers.${index}`,
    defaultValue: '',
    rules: { required: true },
  })
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
  useEffect(() => {
    return () => {
      removePair(self)
    }
  }, [])

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
      onClick={toggleSelf}
      id={`tc-${id}`}
    />
  )
}
