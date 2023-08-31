import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { ModelCreatingForm, useModel } from '@/api/model'
import { Box, Card, Divider, Grid, Input, Stack, Textarea, Typography } from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { UserWidget } from '@/component/basic/getters'
import { useUser } from '@/api/user'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { BigSwitch } from '@/component/basic/CustomInput'
import InnerLinkButton from '@/component/basic/innerLink/InnerLinkButton'
import { LayerGraphEditor } from '@/component/visualization/svgEditors'
import { useEffect } from 'react'
import MutationController from '@/component/basic/MutationController'

export default function EditModel() {
  const { id: modelId } = useParams<{ id: string }>()
  const { model, fetchingModel, updateModel, updatingModel } = useModel(Number(modelId))
  const { user } = useUser()
  const isOwner = !!user && user.id === model?.user_id

  const navigate = useNavigate()
  const methods = useForm<ModelCreatingForm>()
  const { register, control, reset } = methods
  const onSubmit: SubmitHandler<ModelCreatingForm> = async (data) => {
    const { id } = await updateModel(data)
    navigate(`/model/${id}`)
  }
  useEffect(() => {
    if (model) reset(model)
  }, [model, reset])

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
                defaultValue={model.private}
                render={({ field }) => (
                  <BigSwitch {...field} checked={field.value} onLabel="私有" offLabel="公开" />
                )}
              />
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <MutationController
              saveText="保存算法"
              onChange={onSubmit}
              saving={updatingModel}
              methods={methods}
            >
              <InnerLinkButton
                color="neutral"
                variant="soft"
                startDecorator={<ChevronLeftIcon />}
                to={`/model/${modelId}`}
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
          {fetchingModel && <Skeleton variant="rounded" width="100%" height={300} />}
          <Controller
            control={control}
            name="filename"
            render={({ field: { value, onChange } }) => (
              <LayerGraphEditor filename={value} onSave={onChange} />
            )}
          />
        </Grid>
        <Grid sm={12} md={3}>
          <Stack spacing={2}>
            <Card variant="soft">
              <Typography level="h5" gutterBottom>
                算法描述
              </Typography>
              <Textarea minRows={3} placeholder="算法描述" {...register('description')} />
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
