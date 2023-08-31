import SaveIcon from '@mui/icons-material/Save'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'

import { ProjectCreatingForm, useProject } from '@/api/project'
import { ProjectGraphEditor } from '@/component/visualization/svgEditors'
import { Box, Button, Card, Divider, Grid, Input, Stack, Textarea, Typography } from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { UserWidget } from '@/component/basic/getters'
import { useUser } from '@/api/user'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { BigSwitch } from '@/component/basic/CustomInput'
import InnerLinkButton from '@/component/basic/innerLink/InnerLinkButton'
import { useCallback, useEffect } from 'react'
import MutationController from '@/component/basic/MutationController'

export default function EditProject() {
  const { id: projectId } = useParams<{ id: string }>()
  const { project, fetchingProject, updateProject, updatingProject } = useProject(Number(projectId))
  const { user } = useUser()
  const isOwner = !!user && user.id === project?.user_id

  const navigate = useNavigate()
  const methods = useForm<ProjectCreatingForm>()
  const { register, control, reset } = methods
  const onSubmit = useCallback(async (data: ProjectCreatingForm) => {
    console.log('asdf')
    const { id } = await updateProject(data)
    navigate(`/project/${id}`)
  }, [])
  useEffect(() => {
    reset(project)
  }, [project, reset])

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
              <Input {...register('name', { required: true })} sx={{ width: 200 }} />
              <Controller
                control={control}
                name="private"
                defaultValue={project.private}
                render={({ field }) => (
                  <BigSwitch {...field} checked={field.value} onLabel="私有" offLabel="公开" />
                )}
              />
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <MutationController
              saveText="保存项目"
              onChange={onSubmit}
              saving={updatingProject}
              methods={methods}
            >
              <InnerLinkButton
                color="neutral"
                variant="soft"
                startDecorator={<ChevronLeftIcon />}
                to={`/project/${projectId}`}
              >
                返回
              </InnerLinkButton>
            </MutationController>
          </>
        )}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid sm={12} md={9}>
          {fetchingProject && <Skeleton variant="rounded" width="100%" height={300} />}
          <ProjectGraphEditor projectId={Number(projectId)} />
        </Grid>
        <Grid sm={12} md={3}>
          <Stack spacing={2}>
            <Card variant="soft">
              <Typography level="h5" gutterBottom>
                项目描述
              </Typography>
              <Textarea minRows={3} placeholder="项目描述" {...register('description')} />
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
