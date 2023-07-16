import { DatasetCreatingForm, useCreateDataset } from '@/api/dataset'
import { UserWidget } from '@/component/basic/getters'
import {
  Box,
  Button,
  Container,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Typography,
} from '@mui/joy'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function NewDataset() {
  const { search } = useLocation()
  const taskId = new URLSearchParams(search).get('taskId')
  const { createDataset, creatingDataset } = useCreateDataset()
  const { register, handleSubmit, control, reset } = useForm<DatasetCreatingForm>()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<DatasetCreatingForm> = async (data) => {
    const { id } = await createDataset(data)
    navigate(`/dataset/${id}`)
  }
  useEffect(() => {
    reset({
      title: '',
      description: '',
      private: false,
      task_id: Number(taskId),
    })
  }, [taskId, reset])

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} pt={4}>
          <Typography level="h3">新建数据集</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <UserWidget />
            <Typography level="h6">/</Typography>
            <Input placeholder="数据集名称" {...register('title', { required: true })} />
          </Stack>
          <Textarea minRows={3} placeholder="数据集描述" {...register('description')} />
          <Controller
            name="private"
            control={control}
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                defaultValue="public"
                onChange={(e) => onChange(e.target.value == 'private')}
                value={value ? 'private' : 'public'}
              >
                <Box>
                  <Radio value="public" label="公开" />
                  <Typography level="body2" sx={{ ml: 2 }}>
                    所有人都可以通过搜索看到你的数据集、并将你的数据集加入到自己的项目中
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Radio value="private" label="私有" />
                  <Typography level="body2" sx={{ ml: 2 }}>
                    只有你自己可以看到你的数据集
                  </Typography>
                </Box>
              </RadioGroup>
            )}
          />
          <Divider />
          <Button
            type="submit"
            loading={creatingDataset}
            disabled={creatingDataset}
            sx={{ alignSelf: 'flex-end' }}
          >
            创建
          </Button>
        </Stack>
      </form>
    </Container>
  )
}
