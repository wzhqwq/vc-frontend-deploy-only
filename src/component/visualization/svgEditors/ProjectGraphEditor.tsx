import AddIcon from '@mui/icons-material/Add'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import SaveIcon from '@mui/icons-material/Save'
import RestartAltIcon from '@mui/icons-material/RestartAlt'

import { ProjectGraph, TaskData } from '@/types/config/project'
import { Project } from '@/types/entity/project'
import { Box, Button, Divider, FormLabel, Stack, Typography } from '@mui/joy'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useCreateTaskGroup, useTaskGroup } from '@/api/task'
import { AlgorithmTaskCard, PreprocessTaskCard } from './TaskCard'
import { nanoid } from 'nanoid'
import { FormProvider, UseFieldArrayRemove, useFieldArray, useForm } from 'react-hook-form'
import { useProject } from '@/api/project'
import { useNavigate } from 'react-router-dom'
import Collapse from '@mui/material/Collapse'
import Fade from '@mui/material/Fade'
import { ReadonlyContext } from '@/component/context/ReadonlyContext'
import { TASK_CREATED, TASK_FINISHED } from '@/utils/constants'
import { TaskConnectingContextProvider } from '@/component/context/TaskConnectingContext'
import { algorithmConfigDict, preprocessConfigDict } from '@/config/projectGraph/taskData'
import { BigSwitch } from '@/component/basic/CustomInput'
import equal from 'deep-equal'

interface ProjectGraphEditorProps {
  readonly?: boolean
  canRun?: boolean
  projectId: number
  groupId?: number
}

export default function ProjectGraphEditor({
  readonly = false,
  canRun = false,
  projectId,
  groupId,
}: ProjectGraphEditorProps) {
  const { group, tasks } = useTaskGroup(groupId)
  const { project, updateProject, updatingProject } = useProject(projectId)
  const methods = useForm<ProjectGraph>({ mode: 'onBlur' })
  const {
    formState: { isDirty, isValid },
    reset,
    handleSubmit,
  } = methods
  const [useGroupConfig, setUseGroupConfig] = useState(true)
  const config = useMemo(() => {
    const projectConfig = project?.config
    // 必须有项目配置
    if (!projectConfig) return
    // 如果没有参考组，直接返回项目配置，也不可能对应上taskId
    if (!groupId) return projectConfig

    const groupConfig = group?.config
    // 如果有参考组，则必须有组配置和任务列表
    if (!tasks || !groupConfig) return
    // 先将所有任务对应到组配置所有任务数据的taskId上
    const fillInTaskId = (taskData: TaskData<any>) =>
      ({
        ...taskData,
        taskId: tasks?.find((t) => t.item_id == taskData.id)?.id,
      }) as TaskData<any>
    const groupConfigWithTaskId = {
      preProcesses: groupConfig.preProcesses.map(fillInTaskId),
      algorithms: groupConfig.algorithms.map(fillInTaskId),
      analyses: groupConfig.analyses.map(fillInTaskId),
    } as ProjectGraph
    // 如果用户选择查看组配置，直接返回
    if (useGroupConfig) return groupConfigWithTaskId

    // 如果用户选择查看项目配置，需要确定哪些任务卡片可以继续使用现有的任务id（配置完全相同）
    const checkAndFillInTaskId = (taskData: TaskData<any>, groupSlot: TaskData<any>[]) => {
      const groupTaskData = groupSlot.find((t) => t.id == taskData.id)
      // 找到id相同的组配置任务，且配置完全相同，直接使用组配置的taskId
      if (groupTaskData) {
        const filledTaskData = {
          ...taskData,
          taskId: groupTaskData.taskId,
        }
        if (equal(groupTaskData, filledTaskData)) return filledTaskData
      }
      // 否则，没有对应的taskId
      return taskData
    }
    return {
      preProcesses: projectConfig.preProcesses.map((taskData) =>
        checkAndFillInTaskId(taskData, groupConfigWithTaskId.preProcesses),
      ),
      algorithms: projectConfig.algorithms.map((taskData) =>
        checkAndFillInTaskId(taskData, groupConfigWithTaskId.algorithms),
      ),
      analyses: projectConfig.analyses.map((taskData) =>
        checkAndFillInTaskId(taskData, groupConfigWithTaskId.analyses),
      ),
    }
  }, [group, project, tasks, useGroupConfig])

  useEffect(() => {
    reset(config)
  }, [config])

  const allTasks = useMemo<TaskData<any>[]>(() => {
    if (!config) return []
    const pureTasks = [...config.preProcesses, ...config.algorithms, ...config.analyses]
    const keepFinishedTask = (data: TaskData<any>) => ({
      ...data,
      taskId:
        data.taskId && tasks?.find((task) => task.id == data.taskId)?.status == TASK_FINISHED
          ? data.taskId
          : undefined,
    })
    return pureTasks.map(keepFinishedTask)
  }, [config, tasks])

  return project ? (
    <Box>
      <Box
        sx={(theme) => ({
          position: 'sticky',
          top: 0,
          bgcolor: theme.vars.palette.background.surface,
          zIndex: 200,
        })}
      >
        <Collapse in={(!readonly && isDirty) || canRun}>
          <Stack direction="row" alignItems="center" spacing={2} p={1}>
            {groupId && (
              <>
                <FormLabel>配置图来源</FormLabel>
                <BigSwitch
                  checked={useGroupConfig}
                  onChange={(e) => setUseGroupConfig(e.target.checked)}
                  onLabel="任务"
                  offLabel="项目"
                />
              </>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Fade in={!readonly && isDirty}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ '.MuiButton-root': { flexShrink: 0 } }}
              >
                <Button
                  variant="solid"
                  startDecorator={<SaveIcon />}
                  color="primary"
                  onClick={handleSubmit((data) =>
                    updateProject({
                      ...project,
                      config: {
                        preProcesses: data.preProcesses.map(({ taskId: _, ...rest }) => rest),
                        algorithms: data.algorithms.map(({ taskId: _, ...rest }) => rest),
                        analyses: data.analyses.map(({ taskId: _, ...rest }) => rest),
                      },
                    }).then(() => {
                      if (groupId) setUseGroupConfig(false)
                    }),
                  )}
                  disabled={!isValid || updatingProject}
                  loading={updatingProject}
                >
                  {groupId ? '保存至项目' : '保存'}
                </Button>
                <Button
                  variant="soft"
                  startDecorator={<ReplayRoundedIcon />}
                  color="primary"
                  onClick={() => reset()}
                >
                  重置
                </Button>
              </Stack>
            </Fade>
            <Collapse in={canRun && allTasks.length > 0} orientation="horizontal">
              <Runner project={project} noRestart={!groupId} allTasks={allTasks} />
            </Collapse>
          </Stack>
        </Collapse>
      </Box>
      <FormProvider {...methods}>
        <ReadonlyContext.Provider value={readonly}>
          <Box sx={{ overflowX: 'auto', overflowY: 'clip', pb: 4 }}>
            <Box sx={{ minWidth: 1000 }}>
              <TaskConnectingContextProvider>
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
                    taskType="preprocess"
                    initialParameters={preprocessConfigDict.default}
                    inCount={0}
                  />
                  <Divider orientation="vertical" />
                  <TaskSlot
                    title="算法"
                    name="algorithms"
                    renderer={(task, index, remove) => (
                      <AlgorithmTaskCard key={task.id} index={index} remove={remove} />
                    )}
                    taskType="algo"
                    initialParameters={algorithmConfigDict.default}
                    inCount={1}
                  />
                  {/* <Divider orientation="vertical" />
                <TaskSlot
                  title="分析"
                  renderer={() => <div>结束</div>}
                  initialParameters={{}}
                /> */}
                </Box>
              </TaskConnectingContextProvider>
            </Box>
          </Box>
        </ReadonlyContext.Provider>
      </FormProvider>
    </Box>
  ) : null
}

interface TaskSlotProps<T extends Record<string, any>> {
  title: string
  name: keyof ProjectGraph
  renderer: (task: TaskData<T>, index: number, remove: UseFieldArrayRemove) => JSX.Element
  taskType: string
  initialParameters: T
  inCount: number
}
function TaskSlot<T extends Record<string, any>>({
  title,
  name,
  renderer,
  taskType,
  initialParameters,
  inCount,
}: TaskSlotProps<T>) {
  const { fields, append, remove } = useFieldArray<ProjectGraph, keyof ProjectGraph>({ name })
  const readonly = useContext(ReadonlyContext)
  const handleAdd = () => {
    const id = nanoid()
    const taskData: TaskData<T> = {
      id,
      task_type: taskType,
      parameters: initialParameters,
      inPeers: Array(inCount).fill(''),
    }
    append(taskData)
  }
  return (
    <Stack alignItems="center" spacing={1}>
      <Typography level="h5" sx={{ my: 2 }}>
        {title}
      </Typography>
      {fields.map((task, index) => renderer(task, index, remove))}
      {!readonly && (
        <Button variant="soft" size="lg" startDecorator={<AddIcon />} fullWidth onClick={handleAdd}>
          添加
        </Button>
      )}
    </Stack>
  )
}

function Runner({
  project,
  noRestart,
  allTasks,
}: {
  project: Project
  noRestart: boolean
  allTasks: TaskData<any>[]
}) {
  const { createTaskGroup } = useCreateTaskGroup(project.id)
  const [newGroupId, setNewGroupId] = useState<number>()
  const [tasksToCreate, setTasksToCreate] = useState<TaskData<any>[]>([])
  const { group, tasks, createTask, startGroup } = useTaskGroup(newGroupId)

  const navigate = useNavigate()

  const finishedTaskIds = useMemo(
    () => allTasks.map((d) => d.taskId).filter((id): id is number => id != undefined),
    [allTasks],
  )
  const startTaskGroup = async () => {
    const { id } = await createTaskGroup({
      finished_task_ids: finishedTaskIds,
    })
    setNewGroupId(id)
    setTasksToCreate(allTasks.filter((d) => !d.taskId))
  }
  const restartTaskGroup = async () => {
    const { id } = await createTaskGroup({ finished_task_ids: [] })
    setNewGroupId(id)
    setTasksToCreate(allTasks)
  }
  useEffect(() => {
    if (!tasks) return
    setTasksToCreate((tasksToCreate) =>
      tasksToCreate.filter((d) => tasks.find((t) => t.item_id == d.id) == undefined),
    )
  }, [tasks])
  useEffect(() => {
    if (!tasks) return
    if (tasksToCreate.length) {
      const taskToCreate = tasksToCreate[0]
      createTask({
        item_id: taskToCreate.id,
        task_type: taskToCreate.task_type,
        pre_task_ids: taskToCreate.inPeers
          .map((id) => tasks.find((t) => t.item_id == id)?.id)
          .filter((id): id is number => id != undefined),
        data_config: taskToCreate.parameters,
      })
    } else if (group?.status == TASK_CREATED)
      startGroup().then(() => navigate(`/task/${newGroupId}`))
  }, [tasksToCreate])

  return noRestart ? (
    <Button
      variant="solid"
      startDecorator={<PlayArrowRoundedIcon />}
      color="primary"
      onClick={startTaskGroup}
    >
      运行
    </Button>
  ) : finishedTaskIds.length ? (
    <>
      <Button
        variant="solid"
        startDecorator={<PlayArrowRoundedIcon />}
        color="primary"
        onClick={startTaskGroup}
        sx={{ mr: 2 }}
      >
        继续运行
      </Button>
      <Button
        variant="soft"
        startDecorator={<RestartAltIcon />}
        color="primary"
        onClick={restartTaskGroup}
      >
        重新运行
      </Button>
    </>
  ) : (
    <Button
      variant="solid"
      startDecorator={<RestartAltIcon />}
      color="primary"
      onClick={restartTaskGroup}
    >
      重新运行
    </Button>
  )
}
