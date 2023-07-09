import { Box } from '@mui/joy'

export interface TaskConnectorProps {
  type: 'input' | 'output'
  id: string
}
export function TaskConnector(props: TaskConnectorProps) {
  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.vars.palette.primary[300],
        width: 16,
        height: 16,
        m: -1,
        borderRadius: 8,
      })}
      id={`task-connector-${props.id}-${props.type}`}
    />
  )
}
