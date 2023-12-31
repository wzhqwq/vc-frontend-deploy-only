import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'

import { useProject } from '@/api/project'
import { ProjectGraphEditor } from '@/component/visualization/svgEditors'
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
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
import { useUser } from '@/api/user'
import InnerLinkButton from '@/component/basic/innerLink/InnerLinkButton'
import InnerLinkListItemButton from '@/component/basic/innerLink/InnerLinkListItemButton'
import { useState } from 'react'

export default function ViewProject() {
  const { id: projectId } = useParams<{ id: string }>()
  const { project, fetchingProject, deleteProject, deletingProject } = useProject(Number(projectId))
  const { taskGroups, fetchingTaskGroups, refetchTaskGroup } = useProjectTaskGroups(Number(projectId))
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
                <UserWidget userId={project.user_id} />
              </Typography>
              <ChevronRightIcon color="secondary" />
              <Typography component="div" level="h4">
                {project.name}
              </Typography>
              <Chip variant="outlined" size="sm">
                {project.private ? '私有' : '公开'}
              </Chip>
              <Divider orientation="vertical" />
              <Box>
                <Typography level='body2'>创建时间</Typography>
                <Typography level='body1'>{formatTime(project.created_at)}</Typography>
              </Box>
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
                <InnerLinkButton
                  component="a"
                  color="primary"
                  variant="soft"
                  startDecorator={<EditIcon />}
                  to={`/project/${projectId}/edit`}
                >
                  编辑项目
                </InnerLinkButton>
              </>
            )}
            <InnerLinkButton
              component="a"
              color="primary"
              variant="soft"
              startDecorator={<FileCopyIcon />}
              to={`/project/new?copy=${projectId}`}
            >
              复制项目
            </InnerLinkButton>
          </>
        )}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid sm={12} md={9}>
          {fetchingProject && <Skeleton variant="rounded" width="100%" height={300} />}
          <ProjectGraphEditor projectId={Number(projectId)} canRun={isOwner} readonly />
        </Grid>
        <Grid sm={12} md={3}>
          <Stack spacing={2}>
            <Card variant="soft">
              <Typography level="h5" gutterBottom>
                项目描述
              </Typography>
              {project && <Typography level="body1">{project.description}</Typography>}
              {fetchingProject && <FakeParagraph />}
            </Card>
            <Card variant="soft">
              <Stack direction="row" alignItems="center" justifyContent='space-between'>
                <Typography level="h5" gutterBottom>
                  历史任务
                </Typography>
                <IconButton onClick={refetchTaskGroup} color='neutral'>
                  <ReplayRoundedIcon />
                </IconButton>
              </Stack>
              <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                {taskGroups?.map((taskGroup) => (
                  <ListItem key={taskGroup.id}>
                    <InnerLinkListItemButton component="a" to={`/task/${taskGroup.id}`}>
                      <ListItemDecorator>{taskStatusIcon[taskGroup.status]}</ListItemDecorator>
                      <ListItemContent>
                        <Typography level="body1">{taskStatusText[taskGroup.status]}</Typography>
                        <Typography level="body2">{formatTime(taskGroup.created_at)}</Typography>
                      </ListItemContent>
                    </InnerLinkListItemButton>
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
