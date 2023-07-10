import { ProjectCreatingForm, useProject } from '@/api/project'
import { ProjectGraphEditor } from '@/component/visualization/svgEditors'
import { Box, Button, Card, Chip, Divider, Grid, Input, Stack, Switch, Textarea, Typography } from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { UserWidget } from '@/component/basic/getters'

import SaveIcon from '@mui/icons-material/Save'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useUser } from '@/api/user'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function EditProject() {
  const { id: projectId } = useParams<{ id: string }>()
  const { project, fetchingProject, updateProject, updatingProject } = useProject(Number(projectId))
  const { user } = useUser()
  const isOwner = !!user && user.id === project?.user_id

  const navigate = useNavigate()
  const { register, control, handleSubmit } = useForm({ values: project })
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
                <UserWidget />
              </Typography>
              <ChevronRightIcon color="secondary" />
              <Input {...register('name', { required: true })} sx={{ width: 200 }} />
              <Controller
                control={control}
                name="private"
                render={({ field }) => (
                  <Switch
                    {...field}
                    onChange={field.onChange}
                    checked={field.value}
                    slotProps={{
                      track: {
                        children: (
                          <>
                            <Typography component="span" level="inherit" sx={{ ml: '10px' }}>
                              私有
                            </Typography>
                            <Typography component="span" level="inherit" sx={{ mr: '10px' }}>
                              公开
                            </Typography>
                          </>
                        ),
                      },
                    }}
                    sx={{
                      '--Switch-thumbSize': '30px',
                      '--Switch-thumbWidth': '36px',
                      '--Switch-trackWidth': '80px',
                      '--Switch-trackHeight': '36px',
                    }}
                  />
                )}
              />
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="primary"
              variant="soft"
              startDecorator={<SaveIcon />}
              loading={updatingProject}
              disabled={!isOwner || updatingProject}
              onClick={handleSubmit(onSubmit)}
            >
              保存修改
            </Button>
          </>
        )}
      </Stack>
      <Divider sx={{ mt: 2 }} />
      <Grid container spacing={4}>
        <Grid sm={12} md={9}>
          {fetchingProject && <Skeleton variant="rounded" width="100%" height={300} />}
          <ProjectGraphEditor projectId={Number(projectId)} />
        </Grid>
        <Grid sm={12} md={3}>
          <Stack spacing={2} mt={2}>
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
