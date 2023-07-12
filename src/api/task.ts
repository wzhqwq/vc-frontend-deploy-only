import { useDelete, useErrorlessQuery, usePost, usePut } from './common'
import { Task, TaskGroup } from '@/types/entity/task'
import { queryClient } from './queryClient'
import { useCallback, useEffect, useMemo } from 'react'

export interface QueryTaskGroupsResult {
  taskGroups: TaskGroup[]
  fetchingTaskGroups: boolean
  refetchTaskGroup: () => void
}
export function usePublicTaskGroups(): QueryTaskGroupsResult {
  const {
    data: taskGroups,
    isFetching: fetchingTaskGroups,
    refetch: refetchTaskGroup,
  } = useErrorlessQuery<TaskGroup[]>(
    {
      queryKey: ['private', 'algo', 'projects', 'task_groups'],
    },
    '获取公开任务失败',
  )

  return {
    taskGroups,
    fetchingTaskGroups,
    refetchTaskGroup,
  } as QueryTaskGroupsResult
}

export interface CreateTaskGroupResult {
  createTaskGroup: () => Promise<TaskGroup>
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
  const { mutateAsync: createTaskGroup } = usePost<TaskGroup, undefined>(
    ['private', 'algo', 'projects', projectId, 'task_groups'],
    '创建任务失败',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'projects', projectId, 'task_groups'])
      },
    },
  )

  return {
    taskGroups: useMemo(() => taskGroups ?? ([] as TaskGroup[]), [taskGroups]),
    fetchingTaskGroups,
    refetchTaskGroup,

    createTaskGroup: useCallback(() => createTaskGroup(undefined), []),
  } as QueryTaskGroupsResult & CreateTaskGroupResult
}

type TaskCreatingForm = Pick<Task, 'task_type' | 'pre_task_ids' | 'item_id'> & { data_config: any }

export function useTaskGroup(groupId?: number, autoUpdate = false) {
  const { data: group, isFetching: fetchingGroup } = useErrorlessQuery<TaskGroup>(
    {
      queryKey: ['private', 'algo', 'task_groups', groupId],
      enabled: groupId !== undefined,
      refetchInterval: autoUpdate ? 1000 : false,
    },
    '获取历史任务失败',
  )
  const { data: tasks, isFetching: fetchingTasks } = useErrorlessQuery<Task[]>(
    {
      queryKey: ['private', 'algo', 'task_groups', groupId, 'tasks'],
      enabled: groupId !== undefined,
      refetchInterval: autoUpdate ? 1000 : false,
    },
    '获取历史任务子任务失败',
  )
  const { mutateAsync: createTask } = usePost<
    Task,
    Omit<TaskCreatingForm, 'data_config'> & { data_config: string }
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
      onSuccess: (group) => {
        queryClient.setQueryData(['private', 'algo', 'task_groups', groupId], group)
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
  })

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
        }),
      [],
    ),

    startGroup: useCallback(() => startGroup(undefined), []),
    terminateGroup: useCallback(() => terminateGroup(undefined), []),
    terminatingGroup,
  }
}

export function useTask(taskId?: number) {
  const { data: task, isFetching: fetchingTask } = useErrorlessQuery<Task>(
    {
      queryKey: ['private', 'algo', 'tasks', taskId],
      enabled: taskId !== undefined,
    },
    '获取任务详情失败',
  )

  return {
    task,
    fetchingTask,
  }
}
