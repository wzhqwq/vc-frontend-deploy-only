import { Project } from '@/types/entity/project'
import { useErrorlessQuery, usePost, usePut, useDelete } from './common'
import { queryClient } from './queryClient'

type ProjectCreatingForm = Pick<Project, 'name' | 'config'>

export function useProjects(isPublic: boolean) {
  const { data: projects, isFetching: fetchingProjects } = useErrorlessQuery<Project[]>({
    queryKey: ['private', 'algo', 'projects', { all: Number(isPublic) }],
  })
  const { mutate: createProject, isLoading: creatingProject } = usePost<
    Project,
    ProjectCreatingForm
  >(['private', 'algo', 'projects'], {
    onSuccess: () => {
      queryClient.invalidateQueries(['private', 'algo', 'projects'])
    }
  })

  return {
    projects,
    fetchingProjects,

    createProject,
    creatingProject,
  }
}

export function useProject(projectId: number) {
  const { data: project, isFetching: fetchingProject } = useErrorlessQuery<Project>({
    queryKey: ['private', 'algo', 'projects', projectId],
  })
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

    updateProject,
    updatingProject,

    deleteProject,
    deletingProject,
  }
}
