import { useDelete, useErrorlessQuery, usePost, usePut } from './common'
import { Task, TaskGroup } from '@/types/entity/task'
import { queryClient } from './queryClient'
import { Project } from '@/types/entity/project'

export function useProjects(isPublic: boolean) {
  const { data: projects, isFetching: fetchingProjects } = useErrorlessQuery<Project[]>({
    queryKey: isPublic ? ['public', 'algo', 'projects'] : ['private', 'user', 'algo', 'projects'],
  })
  const { mutate: createProject, isLoading: creatingProject } = usePost<Project, ProjectCreatingForm>(
    ['private', 'algo', 'projects'],
  )

  return {
    projects,
    fetchingProjects,

    createProject,
    creatingProject,
  }
}

type ProjectCreatingForm = Pick<Project, 'name' | 'config'>
export function useProject(projectId: number) {
  const { data: project, isFetching: fetchingProject } = useErrorlessQuery<Project>({
    queryKey: ['private', 'algo', 'projects', projectId],
  })
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
  const { mutate: updateProject, isLoading: updatingProject } = usePut<
    Project,
    ProjectCreatingForm
  >(['private', 'algo', 'projects', projectId], {
    onSuccess: () => {
      queryClient.invalidateQueries(['private', 'algo', 'projects', projectId])
    },
  })
  const { mutate: deleteProject, isLoading: deletingProject } = useDelete(
    ['private', 'algo', 'projects', projectId],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'projects', projectId])
      },
    },
  )

  return {
    project,
    fetchingProject,

    taskGroups,
    fetchingTaskGroups,

    createTaskGroup,
    creatingTaskGroup,

    updateProject,
    updatingProject,

    deleteProject,
    deletingProject,
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
