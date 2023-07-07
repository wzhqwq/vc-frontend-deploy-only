import { useProject } from '@/api/project'
import { CircularProgress } from '@mui/joy'

// export function UserEmail({ userId }: { userId: number }) {
//   const { data: user } = useUser(userId)
//   return <>{user?.email}</>
// }

export function ProjectName({ projectId }: { projectId: number }) {
  const { project, fetchingProject } = useProject(projectId)
  return (
    <>
      {fetchingProject && <CircularProgress />}
      {project?.name}
    </>
  )
}
