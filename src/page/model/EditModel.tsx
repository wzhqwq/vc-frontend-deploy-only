import SaveIcon from '@mui/icons-material/Save'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { ModelCreatingForm, useModel } from '@/api/model'
import { Box, Button, Card, Divider, Grid, Input, Stack, Textarea, Typography } from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { UserWidget } from '@/component/basic/getters'
import { useUser } from '@/api/user'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { BigSwitch } from '@/component/basic/CustomInput'
import InnerLinkButton from '@/component/basic/innerLink/InnerLinkButton'

export default function EditModel() {
  const { id: modelId } = useParams<{ id: string }>()
  const { model, fetchingModel, updateModel, updatingModel } = useModel(Number(modelId))
  const { user } = useUser()
  const isOwner = !!user && user.id === model?.user_id

  const navigate = useNavigate()
  const { register, control, handleSubmit } = useForm({ defaultValues: model })
  const onSubmit: SubmitHandler<ModelCreatingForm> = async (data) => {
    const { id } = await updateModel(data)
    navigate(`/model/${id}`)
  }

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {fetchingModel && <Skeleton variant="text" sx={{ fontSize: '2rem', width: 100 }} />}
        {model && (
          <>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography component="div" level="h6">
                <UserWidget userId={model.user_id} />
              </Typography>
              <ChevronRightIcon color="secondary" />
              <Input {...register('title', { required: true })} sx={{ width: 200 }} />
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
              color='neutral'
              variant='soft'
              startDecorator={<ChevronLeftIcon />}
              to={`/model/${modelId}`}
            >
              返回
            </InnerLinkButton>
            <Button
              color="primary"
              variant="soft"
              startDecorator={<SaveIcon />}
              loading={updatingModel}
              disabled={!isOwner || updatingModel}
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
          {fetchingModel && <Skeleton variant="rounded" width="100%" height={300} />}
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
