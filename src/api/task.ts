import { useDelete, useErrorlessQuery, usePost, usePut } from './common'
import { Task, TaskGroup } from '@/types/entity/task'
import { queryClient } from './queryClient'

type TaskCreatingForm = Pick<Task, 'algo' | 'data_id' | 'pre_task_ids'>
export function useTaskGroup(groupId: number) {
  const { data: group, isFetching: fetchingGroup } = useErrorlessQuery<TaskGroup>({
    queryKey: ['private', 'algo', 'task_groups', groupId],
  })
  const { data: tasks, isFetching: fetchingTasks } = useErrorlessQuery<Task[]>({
    queryKey: ['private', 'algo', 'task_groups', groupId, 'tasks'],
  })
  const { mutate: createTask, isLoading: creatingTask } = usePost<Task, TaskCreatingForm>(
    ['private', 'algo', 'task_groups', groupId, 'tasks'],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'task_groups', groupId, 'tasks'])
      },
    },
  )
  const { mutate: runGroup, isLoading: runningGroup } = usePut<Task, undefined>(
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
    creatingTask,

    runGroup,
    runningGroup,

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
