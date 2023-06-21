import { LoginForm, useSession } from '@/api/user'
import { Button, Input, Link, Sheet, Typography } from '@mui/joy'
import { useForm, SubmitHandler } from 'react-hook-form'

export default function Login() {
  const { logIn, loggingIn } = useSession()
  const { register, handleSubmit, formState } = useForm<LoginForm>()
  const onSubmit: SubmitHandler<LoginForm> = (data) => logIn(data)

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
          登录系统享受更多功能
        </Typography>
        <Input variant="soft" placeholder="邮箱" {...register('email', { required: true })} />
        <Input variant="soft" placeholder="密码" {...register('password', { required: true })} />

        <Button
          type="submit"
          loading={loggingIn}
          disabled={loggingIn || !formState.isValid}
        >
          登录
        </Button>
        <Link href="/register" sx={{ alignSelf: 'end' }}>
          创建账号
        </Link>
      </Sheet>
    </form>
  )
}
