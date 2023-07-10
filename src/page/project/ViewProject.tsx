import { useProject } from '@/api/project'
import { ProjectGraphEditor } from '@/component/visualization/svgEditors'
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { FakeParagraph } from '@/utils/fake'
import { UserWidget } from '@/component/basic/getters'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

export default function ViewProject() {
  const { id: projectId } = useParams<{ id: string }>()
  const { project, fetchingProject } = useProject(Number(projectId))

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {fetchingProject && <Skeleton variant="text" sx={{ fontSize: '2rem', width: 100 }} />}
        {project && (
          <>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography component="div" level="h6">
                <UserWidget />
              </Typography>
              <ChevronRightIcon color="secondary" />
              <Typography component="div" level="h4">
                {project.name}
              </Typography>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <Button color="danger" variant="soft" startDecorator={<DeleteIcon />}>
              删除项目
            </Button>
            <Button color="neutral" variant="soft" startDecorator={<EditIcon />}>
              编辑项目
            </Button>
          </>
        )}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={4}>
        <Grid sm={12} md={9}>
          {fetchingProject && <Skeleton variant="rounded" width="100%" height={300} />}
          <ProjectGraphEditor projectId={Number(projectId)} readonly />
        </Grid>
        <Grid
          sm={12}
          md={3}
          sx={(theme) => ({ borderLeft: '1px solid', borderColor: theme.vars.palette.divider })}
          pl={2}
        >
          <Typography level="h5" gutterBottom>项目描述</Typography>
          {project && <Typography level="body1">{project.description}</Typography>}
          {fetchingProject && <FakeParagraph />}
        </Grid>
      </Grid>
    </Box>
  )
}
