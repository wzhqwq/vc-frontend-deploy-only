import { useProject } from '@/api/project'
import { ProjectGraphEditor } from '@/component/visualization/svgEditors'
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { FakeParagraph } from '@/utils/fake'
import { UserWidget } from '@/component/basic/getters'
import { useProjectTaskGroups } from '@/api/task'
import { formatTime } from '@/utils/time'
import { taskStatusIcon, taskStatusText } from '@/component/basic/chips'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { useUser } from '@/api/user'

export default function ViewProject() {
  const { id: projectId } = useParams<{ id: string }>()
  const { project, fetchingProject, deleteProject, deletingProject } = useProject(Number(projectId))
  const { taskGroups, fetchingTaskGroups } = useProjectTaskGroups(Number(projectId))
  const { user } = useUser()
  const isOwner = !!user && user.id === project?.user_id

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
              <Chip variant="outlined" size="sm">
                {project.private ? '私有' : '公开'}
              </Chip>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            {isOwner && (
              <>
                <Button
                  color="danger"
                  variant="soft"
                  startDecorator={<DeleteIcon />}
                  onClick={deleteProject}
                  disabled={deletingProject}
                  loading={deletingProject}
                >
                  删除项目
                </Button>
                <Button
                  component="a"
                  color="primary"
                  variant="soft"
                  startDecorator={<EditIcon />}
                  href={`/project/${projectId}/edit`}
                  sx={{ boxSizing: 'border-box' }}
                >
                  编辑项目
                </Button>
              </>
            )}
            <Button
              component="a"
              color="primary"
              variant="soft"
              startDecorator={<FileCopyIcon />}
              href={`/project/new?copy=${projectId}`}
              sx={{ boxSizing: 'border-box' }}
            >
              复制项目
            </Button>
          </>
        )}
      </Stack>
      <Divider sx={{ mt: 2 }} />
      <Grid container spacing={4}>
        <Grid sm={12} md={9}>
          {fetchingProject && <Skeleton variant="rounded" width="100%" height={300} />}
          <ProjectGraphEditor projectId={Number(projectId)} readonly />
        </Grid>
        <Grid sm={12} md={3}>
          <Stack spacing={2} mt={2}>
            <Card variant="soft">
              <Typography level="h5" gutterBottom>
                项目描述
              </Typography>
              {project && <Typography level="body1">{project.description}</Typography>}
              {fetchingProject && <FakeParagraph />}
            </Card>
            <Card variant="soft">
              <Typography level="h5" gutterBottom>
                历史任务
              </Typography>
              <List>
                {taskGroups?.map((taskGroup) => (
                  <ListItem key={taskGroup.id}>
                    <ListItemButton component="a" href={`/task/${taskGroup.id}`}>
                      <ListItemDecorator>{taskStatusIcon[taskGroup.status]}</ListItemDecorator>
                      <ListItemContent>
                        <Typography level="body1">{taskStatusText[taskGroup.status]}</Typography>
                        <Typography level="body2">{formatTime(taskGroup.created_at)}</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {fetchingTaskGroups && <Skeleton variant="rounded" width="100%" height={200} />}
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
