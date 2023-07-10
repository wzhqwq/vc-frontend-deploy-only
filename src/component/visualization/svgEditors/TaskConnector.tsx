import { ProjectGraph } from '@/types/config/project'
import { Box } from '@mui/joy'
import { useFormContext, useWatch } from 'react-hook-form'

export interface TaskConnectorProps {
  type: 'input' | 'output'
  name: `${keyof ProjectGraph}.${number}.id`
}
export function TaskConnector({ type, name }: TaskConnectorProps) {
  const { control } = useFormContext<ProjectGraph>()
  const id = useWatch({ control, name })

  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.vars.palette.primary[300],
        width: 16,
        height: 16,
        m: -1,
        borderRadius: 8,
      })}
      id={`task-connector-${id}-${type}`}
    />
  )
}
