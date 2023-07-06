import { Project } from "@/types/entity/project"
import { Task, TaskGroup } from "@/types/entity/task"
import { useErrorlessQuery, usePost, usePut, useDelete } from "./common"
import { queryClient } from "./queryClient"

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
