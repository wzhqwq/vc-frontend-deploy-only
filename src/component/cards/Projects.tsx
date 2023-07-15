import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AddIcon from '@mui/icons-material/Add'

import { useProjects } from '@/api/project'
import { SearchInput } from '@/component/basic/CustomInput'
import { UserWidget } from '@/component/basic/getters'
import { formatDate } from '@/utils/time'
import { Box, Card, CircularProgress, Grid, Stack, Typography } from '@mui/joy'
import InnerLink from '../basic/innerLink/InnerLink'
import { useState } from 'react'
import InnerLinkButton from '../basic/innerLink/InnerLinkButton'

export default function Projects({ isPublic }: { isPublic: boolean }) {
  const [search, setSearch] = useState('')
  const { projects, fetchingProjects } = useProjects(isPublic, search)

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <SearchInput placeholder="搜索项目" sx={{ flexGrow: 1 }} value={search} onChange={setSearch} />
        <InnerLinkButton variant="solid" to='/project/new' startDecorator={<AddIcon />}>
          创建项目
        </InnerLinkButton>
      </Stack>
      {fetchingProjects && <CircularProgress sx={{ mx: 'auto', mt: 2, display: 'block' }} />}
      <Grid container spacing={2} py={2}>
        {projects?.map((project) => (
          <Grid sm={12} md={6} key={project.id}>
            <Card variant="outlined">
              <div>
                <Typography level="h5">
                  <InnerLink overlay to={`/project/${project.id}`} underline="none">
                    {project.name}
                  </InnerLink>
                </Typography>
                <Typography level="body2">{project.description || '暂无描述'}</Typography>
              </div>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Typography level="body2" component="div">
                  <UserWidget userId={project.user_id} />
                </Typography>
                <Typography level="body2" component="div">
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
