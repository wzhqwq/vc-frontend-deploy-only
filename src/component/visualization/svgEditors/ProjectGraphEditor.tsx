import { ProjectGraph, TaskData } from '@/types/config/project'
import { Project } from '@/types/entity/project'
import { Box, Button, Stack, Typography } from '@mui/joy'
import { useEffect, useMemo } from 'react'
import { useTaskGroup } from '@/api/task'
import { PreprocessTaskCard } from './TaskCard'
import { nanoid } from 'nanoid'
import { defaultImgPreprocessParameter } from '@/config/projectGraph/taskData'
import {
  FormProvider,
  UseFieldArrayRemove,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { useProject } from '@/api/project'

import AddIcon from '@mui/icons-material/Add'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import SaveIcon from '@mui/icons-material/Save'

interface ProjectGraphEditorProps {
  readonly: boolean
  projectId: number
  groupId?: number
}

export default function ProjectGraphEditor({
  readonly,
  projectId,
  groupId,
}: ProjectGraphEditorProps) {
  const { tasks } = useTaskGroup(groupId)
  const { project, updateProject, updatingProject } = useProject(projectId)
  const methods = useForm<ProjectGraph>()
  const {
    formState: { isDirty, isValid },
    reset,
    handleSubmit,
  } = methods

  const hasNewTask = useMemo(() => {
    if (!project) return false
    return (
      project.config.preProcesses.some((t) => !t.taskId) ||
      project.config.algorithms.some((t) => !t.taskId) ||
      project.config.analyses.some((t) => !t.taskId)
    )
  }, [project])

  useEffect(() => {
    if (!project) return
    const fillInTaskId = (taskData: TaskData<any>) => ({
      ...taskData,
      taskId: tasks?.find((t) => t.item_id == taskData.id)?.id,
    })
    reset({
      preProcesses: project.config.preProcesses.map(fillInTaskId),
      algorithms: project.config.algorithms.map(fillInTaskId),
      analyses: project.config.analyses.map(fillInTaskId),
    } as ProjectGraph)
  }, [project, tasks])

  return project ? (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flexGrow: 1 }} />
        {isDirty ? (
          <>
            <Button
              variant="solid"
              startDecorator={<SaveIcon />}
              color="primary"
              onClick={handleSubmit((data) => updateProject({ ...project, config: data }))}
              disabled={!isValid || updatingProject}
              loading={updatingProject}
            >
              保存
            </Button>
            <Button
              variant="soft"
              startDecorator={<ReplayRoundedIcon />}
              color="primary"
              onClick={() => reset()}
            >
              重置
            </Button>
          </>
        ) : !groupId ? (
          <Button variant="solid" startDecorator={<PlayArrowRoundedIcon />} color="primary">
            运行
          </Button>
        ): hasNewTask ? (
          <>
            <Button variant="solid" startDecorator={<PlayArrowRoundedIcon />} color="primary">
              继续运行
            </Button>
            <Button variant="soft" startDecorator={<ReplayRoundedIcon />} color="primary">
              重新运行
            </Button>
          </>
        ) : (
          <Button variant="solid" startDecorator={<ReplayRoundedIcon />} color="primary">
            重新运行
          </Button>
        )}
      </Stack>
      <FormProvider {...methods}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr auto 1fr',
            gap: 2,
            mt: 2,
          }}
        >
          <TaskSlot
            title="预处理"
            name="preProcesses"
            renderer={(task, index, remove) => (
              <PreprocessTaskCard key={task.id} index={index} remove={remove} />
            )}
            initialParameters={defaultImgPreprocessParameter}
          />
          {/* <Divider orientation="vertical" />
            <TaskSlot
              title="算法"
              renderer={() => <div>结束</div>}
              initialParameters={{}}
            />
            <Divider orientation="vertical" />
            <TaskSlot
              title="分析"
              renderer={() => <div>结束</div>}
              initialParameters={{}}
            /> */}
        </Box>
      </FormProvider>
    </Box>
  ) : undefined
}

interface TaskSlotProps<T extends Record<string, any>> {
  title: string
  name: keyof ProjectGraph
  renderer: (task: TaskData<T>, index: number, remove: UseFieldArrayRemove) => JSX.Element
  initialParameters: T
}
function TaskSlot<T extends Record<string, any>>(props: TaskSlotProps<T>) {
  const { control } = useFormContext<ProjectGraph>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: props.name,
  })
  const handleAdd = () => {
    const id = nanoid()
    const taskData: TaskData<T> = {
      id,
      task_type: '',
      parameters: props.initialParameters,
      inPeers: [],
    }
    append(taskData)
  }
  return (
    <Stack alignItems="center" spacing={1}>
      <Typography level="h5" sx={{ mb: 2 }}>
        {props.title}
      </Typography>
      {fields.map((task, index) => props.renderer(task, index, remove))}
      <Button variant="soft" size="lg" startDecorator={<AddIcon />} fullWidth onClick={handleAdd}>
        添加
      </Button>
    </Stack>
  )
}
