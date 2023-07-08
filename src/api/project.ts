import { Project } from '@/types/entity/project'
import { useErrorlessQuery, usePost, usePut, useDelete } from './common'
import { queryClient } from './queryClient'

export type ProjectCreatingForm = Pick<Project, 'name' | 'config' | 'description' | 'private'>

export function useProjects(isPublic: boolean) {
  const { data: projects, isFetching: fetchingProjects } = useErrorlessQuery<Project[]>({
    queryKey: ['private', 'algo', 'projects', { all: Number(isPublic) }],
  })

  return {
    projects,
    fetchingProjects,
  }
}
export function useCreateProject() {
  const { mutateAsync: createProject, isLoading: creatingProject } = usePost<
    Project,
    ProjectCreatingForm
  >(['private', 'algo', 'projects'], {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['private', 'algo', 'projects'])
      queryClient.setQueryData(['private', 'algo', 'projects', data.id], data)
    },
  })

  return {
    createProject,
    creatingProject,
  }
}

export function useProject(projectId?: number) {
  const { data: project, isFetching: fetchingProject } = useErrorlessQuery<Project>({
    queryKey: ['private', 'algo', 'projects', projectId],
    enabled: projectId !== undefined,
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
