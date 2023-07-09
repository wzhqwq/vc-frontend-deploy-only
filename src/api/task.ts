import { useDelete, useErrorlessQuery, usePost, usePut } from './common'
import { Task, TaskGroup } from '@/types/entity/task'
import { queryClient } from './queryClient'
import { useMemo } from 'react'

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
  createTaskGroup: () => void
  creatingTaskGroup: boolean
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
  const { mutate: createTaskGroup, isLoading: creatingTaskGroup } = usePost<TaskGroup, undefined>(
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

    createTaskGroup: () => createTaskGroup(undefined),
    creatingTaskGroup,
  } as QueryTaskGroupsResult & CreateTaskGroupResult
}

type TaskCreatingForm = Pick<Task, 'task_type' | 'data_id' | 'pre_task_ids' | 'item_id'>

export function useTaskGroup(groupId?: number) {
  const { data: group, isFetching: fetchingGroup } = useErrorlessQuery<TaskGroup>(
    {
      queryKey: ['private', 'algo', 'task_groups', groupId],
      enabled: groupId !== undefined,
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
  const { mutateAsync: createTask } = usePost<Task, TaskCreatingForm>(
    ['private', 'algo', 'task_groups', groupId, 'tasks'],
    '创建子任务失败',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'task_groups', groupId, 'tasks'])
      },
    },
  )
  const { mutate: startGroup, isLoading: startingGroup } = usePut<Task, undefined>(
    ['private', 'algo', 'task_groups', groupId, 'process'],
    '启动任务失败',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'task_groups', groupId])
      },
    },
  )
  const { mutate: terminateGroup, isLoading: terminatingGroup } = useDelete(
    ['private', 'algo', 'task_groups', groupId, 'process'],
    '中止任务失败',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'task_groups', groupId])
      },
    },
  )

  return {
    group,
    fetchingGroup,

    tasks: useMemo(() => tasks ?? ([] as Task[]), [tasks]),
    fetchingTasks,

    createTask,

    startGroup,
    startingGroup,

    terminateGroup,
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
