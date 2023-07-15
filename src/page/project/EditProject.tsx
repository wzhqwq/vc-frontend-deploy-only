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

export default function EditProject() {
  const { id: projectId } = useParams<{ id: string }>()
  const { project, fetchingProject, updateProject, updatingProject } = useProject(Number(projectId))
  const { user } = useUser()
  const isOwner = !!user && user.id === project?.user_id

  const navigate = useNavigate()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm({ defaultValues: project })
  const onSubmit: SubmitHandler<ProjectCreatingForm> = async (data) => {
    const { id } = await updateProject(data)
    navigate(`/project/${id}`)
  }

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
                render={({ field }) => (
                  <BigSwitch {...field} checked={field.value} onLabel="私有" offLabel="公开" />
                )}
              />
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <InnerLinkButton
              color="neutral"
              variant="soft"
              startDecorator={<ChevronLeftIcon />}
              to={`/project/${projectId}`}
            >
              返回
            </InnerLinkButton>
            {isDirty && isOwner && (
              <>
                <Button
                  variant="soft"
                  startDecorator={<ReplayRoundedIcon />}
                  color="primary"
                  onClick={() => reset()}
                >
                  重置
                </Button>
                <Button
                  color="primary"
                  variant="soft"
                  startDecorator={<SaveIcon />}
                  loading={updatingProject}
                  disabled={updatingProject || !isValid}
                  onClick={handleSubmit(onSubmit)}
                >
                  保存修改
                </Button>
              </>
            )}
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
