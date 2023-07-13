import { useTask } from '@/api/task'
import { ProjectGraph } from '@/types/config/project'
import { Box, Card, Chip, ChipDelete, IconButton, Stack } from '@mui/joy'
import { taskStatus } from '@/component/basic/chips'
import { memo, useContext, useEffect, useMemo, useRef } from 'react'
import { TaskInputConnector, TaskOutputConnector } from './TaskConnector'
import { UseFieldArrayRemove, useFormContext, useFormState, useWatch } from 'react-hook-form'
import { algorithmConfigParameters, preprocessConfigParameters } from '@/config/projectGraph/taskData'
import ParameterInput from '@/component/basic/ParameterInput'
import { ReadonlyContext } from '@/component/context/ReadonlyContext'
import { checkDirty } from '@/utils/form'

import DeleteIcon from '@mui/icons-material/Delete'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { useResizeObserver } from '@/component/context/TaskConnectingContext'

export interface TaskCardProps {
  index: number
  remove: UseFieldArrayRemove
}
export interface BasicTaskCardProps extends TaskCardProps {
  children: React.ReactNode
  name: keyof ProjectGraph
  inputCount?: number
  outputCount?: number
}
export function BasicTaskCard({
  name,
  index,
  remove,
  children,
  inputCount = 0,
  outputCount = 0,
}: BasicTaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const readonly = useContext(ReadonlyContext)
  const observer = useResizeObserver()
  const inputConnectors = useMemo(
    () =>
      new Array(inputCount)
        .fill(0)
        .map((_, i) => <TaskInputConnector key={i} index={i} name={`${name}.${index}`} />),
    [inputCount],
  )
  const outputConnectors = useMemo(
    () =>
      new Array(outputCount)
        .fill(0)
        .map((_, i) => <TaskOutputConnector key={i} index={i} name={`${name}.${index}`} />),
    [outputCount],
  )
  useEffect(() => {
    if (!cardRef.current || !observer) return
    observer.observe(cardRef.current)
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current)
    }
  }, [observer])

  return (
    <Card variant="outlined" sx={{ p: 0 }} ref={cardRef}>
      <Stack direction="row">
        <Stack justifyContent="space-evenly">{inputConnectors}</Stack>
        <Stack flexGrow={1} p={2} spacing={1}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {!readonly && (
              <>
                <ChangeIndicator name={`${name}.${index}`} />
                <IconButton size="sm" onClick={() => remove(index)} color="danger" variant="plain">
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
              </>
            )}
            <TaskIndicator name={`${name}.${index}.taskId`} />
          </Stack>
          {children}
        </Stack>
        <Stack justifyContent="space-evenly">{outputConnectors}</Stack>
      </Stack>
    </Card>
  )
}
const TaskIndicator = memo(({ name }: { name: `${keyof ProjectGraph}.${number}.taskId` }) => {
  const taskId = useWatch<ProjectGraph>({ name })
  const { task } = useTask(taskId)

  return (task && taskStatus[task.status]) ?? null
})
const ChangeIndicator = memo(({ name }: { name: `${keyof ProjectGraph}.${number}` }) => {
  const { resetField } = useFormContext<ProjectGraph>()
  const { dirtyFields } = useFormState<ProjectGraph>({ name })

  return checkDirty(dirtyFields, `${name}.id`) ? (
    <Chip color="primary" variant="soft">
      新添
    </Chip>
  ) : checkDirty(dirtyFields, name) ? (
    <Chip
      color="warning"
      variant="solid"
      endDecorator={
        <ChipDelete onClick={() => resetField(name)}>
          <ReplayRoundedIcon fontSize="small" />
        </ChipDelete>
      }
    >
      已修改
    </Chip>
  ) : null
})

export function PreprocessTaskCard(props: TaskCardProps) {
  const { index } = props
  const name = `preProcesses.${index}.parameters`

  return (
    <BasicTaskCard {...props} name="preProcesses" outputCount={1}>
      <ParameterInput prefix={name} parameter={preprocessConfigParameters[0]} simple />
      <Stack direction="row" spacing={4}>
        <ParameterInput prefix={name} parameter={preprocessConfigParameters[1]} simple />
        <ParameterInput prefix={name} parameter={preprocessConfigParameters[2]} simple />
      </Stack>
    </BasicTaskCard>
  )
}

export function AlgorithmTaskCard(props: TaskCardProps) {
  const { index } = props
  const name = `algorithms.${index}.parameters`

  return (
    <BasicTaskCard {...props} name="algorithms" inputCount={1} outputCount={1}>
      <ParameterInput prefix={name} parameter={algorithmConfigParameters[0]} simple />
      <ParameterInput prefix={name} parameter={algorithmConfigParameters[1]} simple />
    </BasicTaskCard>
  )
}
