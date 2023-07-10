import { useTask } from '@/api/task'
import { ProjectGraph } from '@/types/config/project'
import { Box, Card, Chip, ChipDelete, IconButton, Stack } from '@mui/joy'
import { taskStatus } from '@/component/basic/chips'
import { memo, useEffect, useMemo } from 'react'
import { TaskConnector } from './TaskConnector'
import {
  UseFieldArrayRemove,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form'
import {
  allPreprocessDataConfigParameters,
  allPreprocessDefaultParameters,
  dataFilenameParameter,
  dataTypeParameter,
} from '@/config/projectGraph/taskData'
import ParameterInput from '@/component/basic/ParameterInput'

import DeleteIcon from '@mui/icons-material/Delete'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'

export interface TaskCardProps {
  index: number
  remove: UseFieldArrayRemove
}
export interface BasicTaskCardProps extends TaskCardProps {
  children: React.ReactNode
  name: keyof ProjectGraph
  showInput?: boolean
  showOutput?: boolean
}
export function BasicTaskCard({
  name,
  index,
  remove,
  children,
  showInput,
  showOutput,
}: BasicTaskCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 0 }}>
      <Stack direction="row" alignItems="center">
        {showInput && <TaskConnector type="input" name={`${name}.${index}.id`} />}
        <Stack flexGrow={1} p={2} spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ChangeIndicator name={`${name}.${index}`} />
            <IconButton size="sm" onClick={() => remove(index)} color="danger" variant="plain">
              <DeleteIcon fontSize="small" />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <TaskIndicator name={`${name}.${index}.taskId`} />
          </Stack>
          {children}
        </Stack>
        {showOutput && <TaskConnector type="output" name={`${name}.${index}.id`} />}
      </Stack>
    </Card>
  )
}
const TaskIndicator = memo(({ name }: { name: `${keyof ProjectGraph}.${number}.taskId` }) => {
  const { control } = useFormContext<ProjectGraph>()
  const taskId = useWatch({ control, name })
  const { task } = useTask(taskId)

  return (task && taskStatus[task.status]) ?? null
})
const ChangeIndicator = memo(({ name }: { name: `${keyof ProjectGraph}.${number}` }) => {
  const { control, resetField } = useFormContext<ProjectGraph>()
  const { dirtyFields } = useFormState({ control, name })
  const [slotName, index] = name.split('.') as [keyof ProjectGraph, number]
  const isDirty = dirtyFields[slotName]?.at(index)
  const isNew = isDirty?.id

  return isNew ? (
    <Chip color="primary" variant="soft">
      新添
    </Chip>
  ) : isDirty ? (
    <>
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
    </>
  ) : null
})

export function PreprocessTaskCard(props: TaskCardProps) {
  const { index } = props
  const name = `preProcesses.${index}.parameters` as `${keyof ProjectGraph}.${number}.parameters`
  const { control, setValue } = useFormContext<ProjectGraph>()
  const { dirtyFields } = useFormState({ control, name })

  const dataType = useWatch({
    control: control,
    name: `preProcesses.${props.index}.parameters.data_type`,
  })
  const dataConfigParameters = useMemo(
    () => allPreprocessDataConfigParameters[dataType],
    [dataType],
  )
  useEffect(() => {
    if (!dirtyFields.preProcesses?.at(index)) return
    setValue(`${name}.data_config`, allPreprocessDefaultParameters[dataType].data_config, {
      shouldDirty: true,
    })
  }, [dataType])

  return (
    <BasicTaskCard {...props} name="preProcesses" showOutput>
      <ParameterInput prefix={name} parameter={dataTypeParameter} simple />
      <Stack direction="row" spacing={4}>
        <ParameterInput prefix={name} parameter={dataFilenameParameter} simple />
        <ParameterInput prefix={name} parameter={dataConfigParameters} simple />
      </Stack>
    </BasicTaskCard>
  )
}
