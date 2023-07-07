import { useProjects } from '@/api/project'
import { SearchInput } from '@/component/basic/CustomInput'
import { UserWidget } from '@/component/basic/getters'
import { formatDate } from '@/utils/time'
import { Box, Card, CircularProgress, Grid, Link, Stack, Typography } from '@mui/joy'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useNavigate } from 'react-router-dom'

export default function ExploreProjects() {
  const { projects, fetchingProjects } = useProjects(true)

  return (
    <Box>
      <SearchInput placeholder="搜索项目" />
      {fetchingProjects && <CircularProgress sx={{ mx: 'auto', mt: 2, display: 'block' }} />}
      <Grid container spacing={2} py={2}>
        {projects?.map((project) => (
          <Grid sm={12} md={6}>
            <Card key={project.id} variant="outlined">
              <div>
                <Typography level="h5">
                  <Link overlay href={`/projects/${project.id}`} underline='none'>
                    {project.name}
                  </Link>
                </Typography>
                <Typography level="body2">{project.description || '暂无描述'}</Typography>
              </div>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Typography level="body2">
                  <UserWidget userId={project.user_id} />
                </Typography>
                <Typography level="body2">
                  <Stack direction="row" alignItems="center" spacing={0.5} useFlexGap>
                    <AccessTimeIcon />
                    {formatDate(project.created_at)}
                  </Stack>
                </Typography>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
