import { UserCreatingForm, useSession } from '@/api/user'
import { Button, Input, Link, Sheet, Typography } from '@mui/joy'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { registerUser, registering } = useSession()
  const { register, handleSubmit, formState } = useForm<UserCreatingForm>()
  const navigate = useNavigate()

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const onSubmit: SubmitHandler<UserCreatingForm> = async (data) => {
    try {
      await registerUser(data)
      navigate('/login')
    }
    catch (e) {
      setErrorMsg((e as Error).message)
    }
  }

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
        <Input
          variant="soft"
          placeholder="邮箱"
          {...register('email', { required: true })}
          type="email"
          autoComplete="username"
        />
        <Input
          variant="soft"
          placeholder="密码"
          {...register('password', { required: true })}
          type="password"
          autoComplete="new-password"
        />
        <Input
          variant="soft"
          placeholder="确认密码"
          {...register('confirmPassword', {
            required: true,
            validate: (value, formValues) => value === formValues.password,
          })}
          type="password"
          autoComplete="new-password"
        />
        {errorMsg && (
          <Typography color="danger" level='body2' sx={{ mt: -2 }}>
            {errorMsg}
          </Typography>
        )}

        <Button type="submit" loading={registering} disabled={registering || !formState.isValid}>
          注册
        </Button>
        <Typography level="body1" sx={{ textAlign: 'end' }}>
          已有账号？
          <Link href="/login">登录</Link>
        </Typography>
      </Sheet>
    </form>
  )
}
