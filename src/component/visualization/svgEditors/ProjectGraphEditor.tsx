import { ProjectGraph, TaskData } from '@/types/config/project'
import { Project } from '@/types/entity/project'
import { Box, Button, Stack, Typography } from '@mui/joy'
import { useEffect, useMemo, useState } from 'react'
import { useProjectTaskGroups, useTaskGroup } from '@/api/task'
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
import { useNavigate } from 'react-router-dom'

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
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        p={1}
        sx={(theme) => ({
          position: 'sticky',
          top: 0,
          bgcolor: theme.vars.palette.background.surface,
          borderBottom: 'solid 1px',
          borderColor: theme.vars.palette.divider,
          zIndex: 100,
        })}
      >
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
        ) : (
          <Runner project={project} noRestart={!groupId} />
        )}
      </Stack>
      <FormProvider {...methods}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr auto 1fr',
            gap: 2,
            p: 1,
          }}
        >
          <TaskSlot
            title="预处理"
            name="preProcesses"
            renderer={(task, index, remove) => (
              <PreprocessTaskCard key={task.id} index={index} remove={remove} />
            )}
            initialParameters={defaultImgPreprocessParameter}
            taskType="preprocess"
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
  ) : null
}

interface TaskSlotProps<T extends Record<string, any>> {
  title: string
  name: keyof ProjectGraph
  renderer: (task: TaskData<T>, index: number, remove: UseFieldArrayRemove) => JSX.Element
  initialParameters: T
  taskType: string
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
      task_type: props.taskType,
      parameters: props.initialParameters,
      inPeers: [],
    }
    append(taskData)
  }
  return (
    <Stack alignItems="center" spacing={1}>
      <Typography level="h5" sx={{ my: 2 }}>
        {props.title}
      </Typography>
      {fields.map((task, index) => props.renderer(task, index, remove))}
      <Button variant="soft" size="lg" startDecorator={<AddIcon />} fullWidth onClick={handleAdd}>
        添加
      </Button>
    </Stack>
  )
}

function Runner({ project, noRestart }: { project: Project; noRestart: boolean }) {
  const { createTaskGroup } = useProjectTaskGroups(project.id)
  const [newGroupId, setNewGroupId] = useState<number>()
  const [tasksToCreate, setTasksToCreate] = useState<TaskData<any>[]>([])
  const { tasks, createTask, startGroup } = useTaskGroup(newGroupId)

  const [creating, setCreating] = useState(false)

  const navigate = useNavigate()

  const newTasks = useMemo(() => {
    if (!project) return []
    return [
      ...project.config.preProcesses.filter((t) => !t.taskId),
      ...project.config.algorithms.filter((t) => !t.taskId),
      ...project.config.analyses.filter((t) => !t.taskId),
    ]
  }, [project])
  const allTasks = useMemo(() => {
    if (!project) return []
    return [
      ...project.config.preProcesses,
      ...project.config.algorithms,
      ...project.config.analyses,
    ]
  }, [project])

  const startTaskGroup = async () => {
    const { id } = await createTaskGroup()
    setNewGroupId(id)
    setTasksToCreate(newTasks)
  }
  const restartTaskGroup = async () => {
    const { id } = await createTaskGroup()
    setNewGroupId(id)
    setTasksToCreate(allTasks)
  }
  useEffect(() => {
    if (!newGroupId || !tasks) return
    const taskToCreate = tasksToCreate.find(
      (d) => tasks.find((t) => t.item_id == d.id) == undefined,
    )
    if (taskToCreate)
      createTask({
        item_id: taskToCreate.id,
        task_type: taskToCreate.task_type,
        pre_task_ids: taskToCreate.inPeers
          .map((id) => tasks.find((t) => t.item_id == id)?.id)
          .filter((id): id is number => id != undefined),
        data_config: taskToCreate.parameters,
      })
    else startGroup().then(() => navigate(`/task/${newGroupId}`))
  }, [newGroupId, tasks])

  return noRestart ? (
    <Button
      variant="solid"
      startDecorator={<PlayArrowRoundedIcon />}
      color="primary"
      onClick={startTaskGroup}
    >
      运行
    </Button>
  ) : newTasks.length ? (
    <>
      <Button
        variant="solid"
        startDecorator={<PlayArrowRoundedIcon />}
        color="primary"
        onClick={startTaskGroup}
      >
        继续运行
      </Button>
      <Button
        variant="soft"
        startDecorator={<ReplayRoundedIcon />}
        color="primary"
        onClick={restartTaskGroup}
      >
        重新运行
      </Button>
    </>
  ) : (
    <Button
      variant="solid"
      startDecorator={<ReplayRoundedIcon />}
      color="primary"
      onClick={restartTaskGroup}
    >
      重新运行
    </Button>
  )
}
