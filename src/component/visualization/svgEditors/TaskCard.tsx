import DeleteIcon from '@mui/icons-material/Delete'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ErrorIcon from '@mui/icons-material/Error'

import { useTask } from '@/api/task'
import { ProjectGraph } from '@/types/config/project'
import {
  Box,
  Card,
  Chip,
  ChipDelete,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  ModalDialog,
  Stack,
} from '@mui/joy'
import { taskStatus } from '@/component/basic/chips'
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { TaskInputConnector, TaskOutputConnector } from './TaskConnector'
import { UseFieldArrayRemove, useFormContext, useFormState, useWatch } from 'react-hook-form'
import { algorithmConfigDict, preprocessConfigDict } from '@/config/projectGraph/taskData'
import ParameterInput from '@/component/basic/ParameterInput'
import { ReadonlyContext } from '@/component/context/ReadonlyContext'
import { checkDirty } from '@/utils/form'
import { useResizeObserver } from '@/component/context/TaskConnectingContext'
import { TASK_ERROR_TERMINATED, TASK_FINISHED } from '@/utils/constants'
import { useRefreshEnabled } from '@/component/context/RefreshContext'
import { download } from '@/utils/action'

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
  const self = `${name}.${index}` as `${keyof ProjectGraph}.${number}`
  const inputConnectors = useMemo(
    () =>
      new Array(inputCount)
        .fill(0)
        .map((_, i) => <TaskInputConnector key={i} index={i} name={self} />),
    [inputCount, self],
  )
  const outputConnectors = useMemo(
    () =>
      new Array(outputCount)
        .fill(0)
        .map((_, i) => <TaskOutputConnector key={i} index={i} name={self} />),
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
          <Stack direction="row" alignItems="center">
            {!readonly && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <ChangeIndicator name={self} />
                <IconButton size="sm" onClick={() => remove(index)} color="danger" variant="plain">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
            <TaskInfo name={self} />
          </Stack>
          {children}
        </Stack>
        <Stack justifyContent="space-evenly">{outputConnectors}</Stack>
      </Stack>
    </Card>
  )
}
const TaskInfo = memo(({ name }: { name: `${keyof ProjectGraph}.${number}` }) => {
  const refreshEnabled = useRefreshEnabled()
  const [autoUpdate, setAutoUpdate] = useState(refreshEnabled)
  const taskId = useWatch<ProjectGraph>({ name: `${name}.taskId` })
  const { task } = useTask(taskId, autoUpdate)
  const { dirtyFields } = useFormState<ProjectGraph>({ name })
  const readonly = useContext(ReadonlyContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    if ((task?.status ?? 0) >= TASK_FINISHED) {
      setAutoUpdate(false)
    }
  }, [task?.status])

  return task && !checkDirty(dirtyFields, name) ? (
    <>
      {!readonly && (
        <>
          <Box sx={{ flexGrow: 1 }} />
          <Divider orientation="vertical" sx={{ mx: 1 }} />
          <Box sx={{ flexGrow: 1 }} />
        </>
      )}
      <Stack direction="row" alignItems="center" spacing={1}>
        {taskStatus[task.status]}
        <IconButton
          size="sm"
          color={task.status == TASK_ERROR_TERMINATED ? 'danger' : 'neutral'}
          variant={task.status == TASK_ERROR_TERMINATED ? 'soft' : 'plain'}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {task.status == TASK_ERROR_TERMINATED ? (
            <ErrorIcon fontSize="small" />
          ) : (
            <MoreHorizIcon fontSize="small" />
          )}
        </IconButton>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        placement="right-start"
        size="sm"
      >
        <MenuItem onClick={() => setShowLogs(true)}>查看日志</MenuItem>
        {task.status == TASK_ERROR_TERMINATED && task.exception && <MenuItem>查看问题</MenuItem>}
        {task.status == TASK_FINISHED && task.task_type == 'preprocess' && task.result && (
          <MenuItem onClick={() => download(task.result!.filename, task.result!.extension)}>
            下载输出数据
          </MenuItem>
        )}
      </Menu>
      <Modal open={showLogs} onClose={() => setShowLogs(false)}>
        <ModalDialog>
          <Box component="pre" sx={{ maxHeight: '80vh', overflow: 'auto' }}>
            <code>{task.log || '暂无日志'}</code>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  ) : null
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
      <ParameterInput prefix={name} parameter={preprocessConfigDict.properties[0]} simple />
      <Stack direction="row" spacing={4}>
        <ParameterInput prefix={name} parameter={preprocessConfigDict.properties[1]} simple />
        <ParameterInput prefix={name} parameter={preprocessConfigDict.properties[2]} simple />
      </Stack>
    </BasicTaskCard>
  )
}

export function AlgorithmTaskCard(props: TaskCardProps) {
  const { index } = props
  const name = `algorithms.${index}.parameters`

  return (
    <BasicTaskCard {...props} name="algorithms" inputCount={1} outputCount={1}>
      <Stack direction="row" spacing={4}>
        <ParameterInput prefix={name} parameter={algorithmConfigDict.properties[0]} simple />
        <ParameterInput prefix={name} parameter={algorithmConfigDict.properties[1]} simple />
      </Stack>
    </BasicTaskCard>
  )
}
