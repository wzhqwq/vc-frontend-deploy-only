import SaveIcon from '@mui/icons-material/Save'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { DatasetCreatingForm, useDataset } from '@/api/dataset'
import { Box, Button, Card, Divider, Grid, Input, Stack, Textarea, Typography } from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { UserWidget } from '@/component/basic/getters'
import { useUser } from '@/api/user'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { BigSwitch } from '@/component/basic/CustomInput'
import InnerLinkButton from '@/component/basic/innerLink/InnerLinkButton'
import { useEffect } from 'react'

export default function EditDataset() {
  const { id: datasetId } = useParams<{ id: string }>()
  const { dataset, fetchingDataset, updateDataset, updatingDataset } = useDataset(Number(datasetId))
  const { user } = useUser()
  const isOwner = !!user && user.id === dataset?.user_id

  const navigate = useNavigate()
  const { register, control, handleSubmit, reset } = useForm<DatasetCreatingForm>()
  const onSubmit: SubmitHandler<DatasetCreatingForm> = async (data) => {
    const { id } = await updateDataset(data)
    navigate(`/dataset/${id}`)
  }
  useEffect(() => {
    if (dataset) reset(dataset)
  }, [dataset, reset])

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {fetchingDataset && <Skeleton variant="text" sx={{ fontSize: '2rem', width: 100 }} />}
        {dataset && (
          <>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography component="div" level="h6">
                <UserWidget userId={dataset.user_id} />
              </Typography>
              <ChevronRightIcon color="secondary" />
              <Input {...register('title', { required: true })} sx={{ width: 200 }} />
              <Controller
                control={control}
                name="private"
                defaultValue={dataset.private}
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
              to={`/dataset/${datasetId}`}
            >
              返回
            </InnerLinkButton>
            <Button
              color="primary"
              variant="soft"
              startDecorator={<SaveIcon />}
              loading={updatingDataset}
              disabled={!isOwner || updatingDataset}
              onClick={handleSubmit(onSubmit)}
            >
              保存修改
            </Button>
          </>
        )}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid sm={12} md={9}>
          {fetchingDataset && <Skeleton variant="rounded" width="100%" height={300} />}
        </Grid>
        <Grid sm={12} md={3}>
          <Stack spacing={2}>
            <Card variant="soft">
              <Typography level="h5" gutterBottom>
                数据集描述
              </Typography>
              <Textarea minRows={3} placeholder="数据集描述" {...register('description')} />
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
