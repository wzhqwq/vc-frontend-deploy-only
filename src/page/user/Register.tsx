import { LoginForm, useSession } from '@/api/user'
import { Button, Input, Link, Sheet, Typography } from '@mui/joy'
import { useForm, SubmitHandler } from 'react-hook-form'

export default function Register() {
  const { registerUser } = useSession()
  const { register, handleSubmit, formState } = useForm<LoginForm>()
  const onSubmit: SubmitHandler<LoginForm> = (data) => registerUser(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 10,
          p: 2,
          pt: 4,
          gap: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography level="h4" sx={{ textAlign: 'center' }}>
          创建账号
        </Typography>
        <Input variant="soft" placeholder="邮箱" {...register('email', { required: true })} />
        <Input variant="soft" placeholder="密码" {...register('password', { required: true })} />
        <Input
          variant="soft"
          placeholder="确认密码"
          {...register('password', { required: true })}
        />

        <Button
          type="submit"
          loading={formState.isSubmitting}
          disabled={formState.isSubmitting || !formState.isValid}
        >
          注册
        </Button>
        <Typography level="body1" sx={{ textAlign: 'end' }}>
          已有账号？
          <Link href="/login">
            登录
          </Link>
        </Typography>
      </Sheet>
    </form>
  )
}
