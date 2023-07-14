import { emptyLayerFile } from '@/api/files'
import { ModelCreatingForm, useCreateModel } from '@/api/model'
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
import { useNavigate } from 'react-router-dom'

export default function NewModel() {
  const { createModel, creatingModel } = useCreateModel()
  const { register, handleSubmit, control } = useForm<ModelCreatingForm>({
    defaultValues: {
      title: '',
      description: '',
      private: false,
      file_id: emptyLayerFile.id,
      kind: 1,
    },
  })
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<ModelCreatingForm> = async (data) => {
    const { id } = await createModel(data)
    navigate(`/model/${id}`)
  }

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} pt={4}>
          <Typography level="h3">新建算法</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <UserWidget />
            <Typography level="h6">/</Typography>
            <Input placeholder="算法名称" {...register('title', { required: true })} />
          </Stack>
          <Textarea minRows={3} placeholder="算法描述" {...register('description')} />
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
                    所有人都可以通过搜索看到你的算法、并将你的算法加入到自己的项目中
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Radio value="private" label="私有" />
                  <Typography level="body2" sx={{ ml: 2 }}>
                    只有你自己可以看到你的算法
                  </Typography>
                </Box>
              </RadioGroup>
            )}
          />
          <Divider />
          <Controller
            name="kind"
            control={control}
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                defaultValue="public"
                onChange={(e) => onChange(Number(e.target.value))}
                value={value}
              >
                <Box>
                  <Radio value="1" label="深度学习" />
                  <Typography level="body2" sx={{ ml: 2 }}>
                    使用可视化编辑器构建深度学习模型
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Radio value="2" label="自定义" />
                  <Typography level="body2" sx={{ ml: 2 }}>
                    上传满足平台通信规范的python代码
                  </Typography>
                </Box>
              </RadioGroup>
            )}
          />
          <Button
            type="submit"
            loading={creatingModel}
            disabled={creatingModel}
            sx={{ alignSelf: 'flex-end' }}
          >
            创建
          </Button>
        </Stack>
      </form>
    </Container>
  )
}
