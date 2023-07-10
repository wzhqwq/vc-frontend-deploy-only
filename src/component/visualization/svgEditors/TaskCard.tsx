import { useTask } from '@/api/task'
import { ProjectGraph } from '@/types/config/project'
import { Box, Card, Chip, IconButton, Stack } from '@mui/joy'
import { taskStatus } from '@/component/basic/chips'
import { useEffect, useMemo } from 'react'
import { TaskConnector } from './TaskConnector'
import { UseFieldArrayRemove, useController, useFormContext, useWatch } from 'react-hook-form'
import {
  allPreprocessDataConfigParameters,
  allPreprocessDefaultParameters,
  dataFilenameParameter,
  dataTypeParameter,
} from '@/config/projectGraph/taskData'
import ParameterInput from '@/component/basic/ParameterInput'

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import DeleteIcon from '@mui/icons-material/Delete'

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
  const { control } = useFormContext<ProjectGraph>()
  const {
    field: { value: taskData },
    fieldState: { isDirty },
  } = useController({
    name: `${name}.${index}`,
    control,
  })
  const { task } = useTask(taskData.taskId)

  return (
    <Card variant="outlined" sx={{ minWidth: 300, p: 0 }}>
      <Stack direction="row" alignItems="center">
        {showInput && <TaskConnector type="input" id={taskData.id} />}
        <Stack flexGrow={1} p={2} spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {!taskData.taskId ? (
              <Chip
                color="primary"
                variant="soft"
                startDecorator={<FiberManualRecordIcon fontSize="small" />}
              >
                新添
              </Chip>
            ) : isDirty ? (
              <>
                <Chip
                  color="warning"
                  variant="soft"
                  startDecorator={<FiberManualRecordIcon fontSize="small" />}
                >
                  已修改
                </Chip>
              </>
            ) : undefined}
            <IconButton size="sm" onClick={() => remove(index)} color="danger" variant="plain">
              <DeleteIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            {task && taskStatus[task.status]}
          </Stack>
          {children}
        </Stack>
        {showOutput && <TaskConnector type="output" id={taskData.id} />}
      </Stack>
    </Card>
  )
}

export function PreprocessTaskCard(props: TaskCardProps) {
  const parameterPrefix = `preProcesses.${props.index}.parameters`
  const { control, resetField } = useFormContext<ProjectGraph>()
  const dataType = useWatch({
    control: control,
    name: `preProcesses.${props.index}.parameters.data_type`,
  })
  const dataConfigParameters = useMemo(
    () => allPreprocessDataConfigParameters[dataType],
    [dataType],
  )
  useEffect(() => {
    // reset((g) => ({
    //   ...g,
    //   preProcesses: g.preProcesses.map((t, i) => {
    //     if (i === index)
    //       return {
    //         ...t,
    //         parameters: allPreprocessDefaultParameters[dataType],
    //       }
    //     return t
    //   }),
    // }))
    resetField(`preProcesses.${props.index}.parameters`, {
      defaultValue: allPreprocessDefaultParameters[dataType],
    })
  }, [dataType, resetField])

  return (
    <BasicTaskCard {...props} name="preProcesses" showOutput>
      <ParameterInput prefix={parameterPrefix} parameter={dataTypeParameter} />
      <Stack direction="row" spacing={4}>
        <ParameterInput prefix={parameterPrefix} parameter={dataFilenameParameter} />
        <ParameterInput prefix={parameterPrefix} parameter={dataConfigParameters} />
      </Stack>
    </BasicTaskCard>
  )
}
