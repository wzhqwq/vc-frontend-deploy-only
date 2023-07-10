import { Project } from '@/types/entity/project'
import { useErrorlessQuery, usePost, usePut, useDelete } from './common'
import { queryClient } from './queryClient'

export type ProjectCreatingForm = Pick<Project, 'name' | 'config' | 'description' | 'private'>

export function useProjects(isPublic: boolean) {
  const { data: projects, isFetching: fetchingProjects } = useErrorlessQuery<Project[]>(
    {
      queryKey: ['private', 'algo', 'projects', { all: Number(isPublic) }],
    },
    '获取项目列表',
  )

  return {
    projects,
    fetchingProjects,
  }
}
export function useCreateProject() {
  const { mutateAsync: createProject, isLoading: creatingProject } = usePost<
    Project,
    Omit<ProjectCreatingForm, 'config'> & { config: string }
  >(['private', 'algo', 'projects'], '创建项目', {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['private', 'algo', 'projects'])
      queryClient.setQueryData(['private', 'algo', 'projects', data.id], data)
    },
  })

  return {
    createProject: (project: ProjectCreatingForm) =>
      createProject({ ...project, config: JSON.stringify(project.config) }),
    creatingProject,
  }
}

export function useProject(projectId?: number) {
  const { data: project, isFetching: fetchingProject } = useErrorlessQuery<Project>(
    {
      queryKey: ['private', 'algo', 'projects', projectId],
      enabled: projectId !== undefined,
    },
    '获取项目信息',
  )
  const { mutate: updateProject, isLoading: updatingProject } = usePut<
    Project,
    Omit<ProjectCreatingForm, 'config'> & { config: string }
  >(['private', 'algo', 'projects', projectId], '更新项目', {
    onSuccess: (project: Project) => {
      queryClient.setQueryData(['private', 'algo', 'projects', projectId], project)
    },
  })
  const { mutate: deleteProject, isLoading: deletingProject } = useDelete(
    ['private', 'algo', 'projects', projectId],
    '删除项目',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'projects', projectId])
      },
    },
  )

  return {
    project,
    fetchingProject,

    updateProject: (project: ProjectCreatingForm) =>
      updateProject({ ...project, config: JSON.stringify(project.config) }),
    updatingProject,

    deleteProject: () => deleteProject(undefined),
    deletingProject,
  }
}
