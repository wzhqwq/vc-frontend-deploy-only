import { useDelete, useErrorlessQuery, usePost, usePut } from './common'
import { Task, TaskGroup } from '@/types/entity/task'
import { queryClient } from './queryClient'

export function usePublicTaskGroups() {
  const { data: groups, isFetching: fetchingGroups } = useErrorlessQuery<TaskGroup[]>({
    queryKey: ['private', 'algo', 'projects', 'task_groups'],
  })

  return {
    groups,
    fetchingGroups,
  }
}

export function useProjectTaskGroups(projectId: number) {
  const { data: taskGroups, isFetching: fetchingTaskGroups } = useErrorlessQuery<Task[]>({
    queryKey: ['private', 'algo', 'projects', projectId, 'task_groups'],
  })
  const { mutate: createTaskGroup, isLoading: creatingTaskGroup } = usePost<TaskGroup, undefined>(
    ['private', 'algo', 'projects', projectId, 'task_groups'],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'projects', projectId, 'task_groups'])
      },
    },
  )

  return {
    taskGroups,
    fetchingTaskGroups,

    createTaskGroup,
    creatingTaskGroup,
  }
}

type TaskCreatingForm = Pick<Task, 'algo' | 'data_id' | 'pre_task_ids'>
export function useTaskGroup(groupId: number) {
  const { data: group, isFetching: fetchingGroup } = useErrorlessQuery<TaskGroup>({
    queryKey: ['private', 'algo', 'task_groups', groupId],
  })
  const { data: tasks, isFetching: fetchingTasks } = useErrorlessQuery<Task[]>({
    queryKey: ['private', 'algo', 'task_groups', groupId, 'tasks'],
  })
  const { mutateAsync: createTask } = usePost<Task, TaskCreatingForm>(
    ['private', 'algo', 'task_groups', groupId, 'tasks'],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'task_groups', groupId, 'tasks'])
      },
    },
  )
  const { mutate: startGroup, isLoading: startingGroup } = usePut<Task, undefined>(
    ['private', 'algo', 'task_groups', groupId, 'process'],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'task_groups', groupId])
      },
    },
  )
  const { mutate: terminateGroup, isLoading: terminatingGroup } = useDelete(
    ['private', 'algo', 'task_groups', groupId, 'process'],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'task_groups', groupId])
      },
    },
  )

  return {
    group,
    fetchingGroup,

    tasks,
    fetchingTasks,

    createTask,

    startGroup,
    startingGroup,

    terminateGroup,
    terminatingGroup,
  }
}

export function useTask(taskId: number) {
  const { data: task, isFetching: fetchingTask } = useErrorlessQuery<Task>({
    queryKey: ['private', 'algo', 'tasks', taskId],
  })

  return {
    task,
    fetchingTask,
  }
}
