import { useProject } from '@/api/project'
import { useUser } from '@/api/user'
import { CircularProgress, Stack } from '@mui/joy'

import PersonOffIcon from '@mui/icons-material/PersonOff'
import PersonIcon from '@mui/icons-material/Person'

export function UserWidget({ userId }: { userId?: number }) {
  const { user, fetchingUser } = useUser(userId)
  return (
    <Stack direction="row" alignItems="center" spacing={0.5} useFlexGap>
      {fetchingUser && <CircularProgress />}
      {user && (
        <>
          {user.is_anon ? (
            <PersonOffIcon color="disabled" />
          ) : (
            <PersonIcon color={user.role_id == 2 ? 'primary' : 'secondary'} />
          )}
          {user.is_anon ? '匿名用户' : user.email}
        </>
      )}
    </Stack>
  )
}

export function ProjectName({ projectId }: { projectId: number }) {
  const { project, fetchingProject } = useProject(projectId)
  return (
    <>
      {fetchingProject && <CircularProgress />}
      {project?.name}
    </>
  )
}
