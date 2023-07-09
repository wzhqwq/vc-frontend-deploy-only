import { useTask } from '@/api/task'
import { PreprocessTaskData, ProjectGraph, TaskData } from '@/types/config/project'
import { Box, Card, Stack, Typography } from '@mui/joy'

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { taskStatus } from '@/component/basic/chips'
import { FileUpload } from '@/component/basic/FileUpload'
import { useMemo } from 'react'
import { TaskConnector } from './TaskConnector'
import { Control, Controller } from 'react-hook-form'
import { FormLabel } from '@mui/material'
import FormModal from '@/component/basic/FormModal'
import { imgDataConfigParameters } from '@/config/projectGraph/taskData'

export interface BasicTaskCardProps<T extends TaskData<Record<string, any>>> {
  taskData: T
  children: React.ReactNode
  originalParameters?: T['parameters']
  showInput?: boolean
  showOutput?: boolean
}
export function BasicTaskCard({
  taskData,
  children,
  originalParameters,
  showInput,
  showOutput,
}: BasicTaskCardProps<TaskData<any>>) {
  const { task } = useTask(taskData.taskId)
  const changed = useMemo(() => {
    if (!originalParameters) return true
    return JSON.stringify(taskData.parameters) !== JSON.stringify(originalParameters)
  }, [taskData, originalParameters])

  return (
    <Card variant="outlined" sx={{ minWidth: 300, p: 0 }}>
      <Stack direction="row" alignItems="center">
        {showInput && <TaskConnector type="input" id={taskData.id} />}
        <Stack flexGrow={1} p={2} spacing={1}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {changed && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <FiberManualRecordIcon sx={{ color: 'warning.main' }} fontSize="small" />
                <Typography level="body2">{taskData.taskId ? '已修改' : '新增'}</Typography>
              </Stack>
            )}
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

export interface TaskCardProps<T extends TaskData<Record<string, any>>> {
  originalParameters?: T['parameters']
  control: Control<ProjectGraph>
  index: number
}
export function PreprocessTaskCard({
  control,
  originalParameters,
  index,
}: TaskCardProps<PreprocessTaskData>) {
  const parameterPrefix = `preProcesses.${index}.parameters`
  return (
    <Controller
      name={`preProcesses.${index}`}
      control={control}
      render={({ field: { value } }) => (
        <BasicTaskCard originalParameters={originalParameters} taskData={value} showOutput>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FormLabel>数据文件</FormLabel>
            <FileUpload name={`${parameterPrefix}.data_file_name`} control={control} />
            <FormModal
              label=''
              description="数据参数"
              name={`${parameterPrefix}.data_config`}
              control={control}
              parameters={imgDataConfigParameters}
            />
          </Stack>
        </BasicTaskCard>
      )}
    />
  )
}
