import { ProjectCreatingForm, useCreateProject } from '@/api/project'
import { UserWidget } from '@/component/basic/getters'
import {
  Box,
  Button,
  Container,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Typography,
} from '@mui/joy'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export default function NewProject() {
  const { createProject, creatingProject } = useCreateProject()
  const { register, handleSubmit, formState, control } = useForm<ProjectCreatingForm>()
  const navigate = useNavigate()
  const onSubmit: SubmitHandler<ProjectCreatingForm> = async (data) => {
    const { id } = await createProject({
      ...data,
      config: { preProcesses: [], algorithms: [], analyses: [] },
    })
    navigate(`/project/${id}`)
  }

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} pt={4}>
          <Typography level="h3">新建项目</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <UserWidget />
            <Typography level="h6">/</Typography>
            <Input placeholder="项目名称" {...register('name', { required: true })} />
          </Stack>
          <Textarea minRows={3} placeholder="项目描述" {...register('description')} />
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
                    所有人都可以通过搜索看到你的项目、复制你的项目
                    <br />
                    项目内只能使用公开的算法
                    <br />
                    从项目启动的任务会在“公开任务”中展示，任何人可以下载任务的原始数据和结果数据
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Radio value="private" label="私有" />
                  <Typography level="body2" sx={{ ml: 2 }}>
                    只有你自己可以看到你的项目
                    <br />
                    项目的运行状况不会在“公开任务”中展示
                  </Typography>
                </Box>
              </RadioGroup>
            )}
          />
          <Button
            type="submit"
            loading={creatingProject}
            disabled={formState.isSubmitting}
            sx={{ alignSelf: 'flex-end' }}
          >
            创建
          </Button>
        </Stack>
      </form>
    </Container>
  )
}
