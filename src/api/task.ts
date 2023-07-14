import { useDelete, useErrorlessQuery, usePost, usePut } from './common'
import { Task, TaskGroup } from '@/types/entity/task'
import { queryClient } from './queryClient'
import { useCallback, useEffect, useMemo } from 'react'
import { ServerGeneratedKeys } from '@/types/entity/common'

export interface QueryTaskGroupsResult {
  taskGroups: TaskGroup[]
  fetchingTaskGroups: boolean
  refetchTaskGroup: () => void
}
export function useTaskGroups(isPublic: boolean): QueryTaskGroupsResult {
  const {
    data: taskGroups,
    isFetching: fetchingTaskGroups,
    refetch: refetchTaskGroup,
  } = useErrorlessQuery<TaskGroup[]>(
    {
      queryKey: ['private', 'algo', 'projects', 'task_groups', { all: Number(isPublic) }],
    },
    '获取公开任务失败',
  )

  return {
    taskGroups,
    fetchingTaskGroups,
    refetchTaskGroup,
  } as QueryTaskGroupsResult
}

export function useProjectTaskGroups(projectId?: number) {
  const {
    data: taskGroups,
    isFetching: fetchingTaskGroups,
    refetch: refetchTaskGroup,
  } = useErrorlessQuery<TaskGroup[]>(
    {
      queryKey: ['private', 'algo', 'projects', projectId, 'task_groups'],
      enabled: projectId !== undefined,
    },
    '获取历史任务失败',
  )

  return {
    taskGroups,
    fetchingTaskGroups,
    refetchTaskGroup,
  } as QueryTaskGroupsResult
}

export type GroupCreatingForm = { finished_task_ids: number[] }
export interface CreateTaskGroupResult {
  createTaskGroup: (form: GroupCreatingForm) => Promise<TaskGroup>
}

export function useCreateTaskGroup(projectId?: number) {
  const { mutateAsync: createTaskGroup } = usePost<TaskGroup, { finished_task_ids: string }>(
    ['private', 'algo', 'projects', projectId, 'task_groups'],
    '创建任务失败',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'projects', projectId, 'task_groups'])
      },
    },
  )
  return {
    createTaskGroup: useCallback(
      (form: GroupCreatingForm) =>
        createTaskGroup({
          finished_task_ids: form.finished_task_ids.join(','),
        }),
      [],
    ),
  }
}

type TaskCreatingForm = Omit<Task, ServerGeneratedKeys | 'data_config'> & { data_config: any }

export function useTaskGroup(groupId?: number, autoUpdate = false) {
  const { data: group, isFetching: fetchingGroup } = useErrorlessQuery<TaskGroup>(
    {
      queryKey: ['private', 'algo', 'task_groups', groupId],
      enabled: groupId !== undefined,
      refetchInterval: autoUpdate ? 3700 : false,
    },
    '获取历史任务失败',
  )
  const { data: tasks, isFetching: fetchingTasks } = useErrorlessQuery<Task[]>(
    {
      queryKey: ['private', 'algo', 'task_groups', groupId, 'tasks'],
      enabled: groupId !== undefined,
    },
    '获取历史任务子任务失败',
  )
  const { mutateAsync: createTask } = usePost<
    Task,
    Omit<TaskCreatingForm, 'data_config' | 'pre_task_ids'> & {
      data_config: string
      pre_task_ids: string
    }
  >(['private', 'algo', 'task_groups', groupId, 'tasks'], '创建子任务失败', {
    onSuccess: () => {
      queryClient.invalidateQueries(['private', 'algo', 'task_groups', groupId, 'tasks'])
    },
  })
  const { mutateAsync: startGroup } = usePut<Task, undefined>(
    ['private', 'algo', 'task_groups', groupId, 'process'],
    '启动任务失败',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'task_groups'])
      },
    },
  )
  const { mutate: terminateGroup, isLoading: terminatingGroup } = useDelete(
    ['private', 'algo', 'task_groups', groupId, 'process'],
    '中止任务失败',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'task_groups', groupId])
        queryClient.invalidateQueries(['private', 'algo', 'task_groups'], { exact: true })
      },
    },
  )
  useEffect(() => {
    if (tasks) {
      tasks.forEach((task) => {
        queryClient.setQueryData(['private', 'algo', 'tasks', task.id], task)
      })
    }
  }, [tasks])

  return {
    group,
    fetchingGroup,

    tasks,
    fetchingTasks,

    createTask: useCallback(
      (form: TaskCreatingForm) =>
        createTask({
          ...form,
          data_config: JSON.stringify(form.data_config),
          pre_task_ids: form.pre_task_ids.join(','),
        }),
      [],
    ),

    startGroup: useCallback(() => startGroup(undefined), []),
    terminateGroup: useCallback(() => terminateGroup(undefined), []),
    terminatingGroup,
  }
}

export function useTask(taskId?: number, autoUpdate = false) {
  const { data: task, isFetching: fetchingTask } = useErrorlessQuery<Task>(
    {
      queryKey: ['private', 'algo', 'tasks', taskId],
      enabled: taskId !== undefined,
      refetchInterval: autoUpdate ? 1100 : false,
    },
    '获取任务详情失败',
  )

  return {
    task,
    fetchingTask,
  }
}
