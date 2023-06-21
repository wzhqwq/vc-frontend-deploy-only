import { useSession, useUser } from '@/api/user'
import { SearchInput } from '@/component/basic/CustomInput'
import { NormalMenuButton } from '@/component/basic/CustomMenu'
import {
  AccountCircle,
  Cloud,
  DeleteSweep,
  ExitToApp,
  ExploreTwoTone,
  HelpTwoTone,
  InfoTwoTone,
  Notifications,
  Person,
  Task,
  TaskTwoTone,
  ViewInAr,
} from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/joy'
import { AppBar, Toolbar } from '@mui/material'
import { memo, useCallback, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import logo from '@/logo.svg'

export default function MainFrame() {
  const { loggedIn } = useSession()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <AppBar position="static">
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            level="h6"
            component="a"
            sx={{
              mr: 1,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              img: { filter: 'grayscale(1)', transition: 'filter 0.3s' },
              '&:hover': { img: { filter: 'grayscale(0)' } },
            }}
            href="/"
          >
            <img src={logo} alt="logo" height={32} width={32} />
            多模态可视化平台
          </Typography>
          <SearchInput placeholder="平台内搜索…" />
          <Button variant="plain" color="neutral">
            <ExploreTwoTone fontSize="small" sx={{ mr: 1 }} />
            探索
          </Button>
          <Button variant="plain" color="neutral">
            <TaskTwoTone fontSize="small" sx={{ mr: 1 }} />
            公开任务
          </Button>
          <Button variant="plain" color="neutral">
            <HelpTwoTone fontSize="small" sx={{ mr: 1 }} />
            指引
          </Button>
          <Button variant="plain" color="neutral">
            <InfoTwoTone fontSize="small" sx={{ mr: 1 }} />
            关于
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {loggedIn ? (
            <>
              <MessageControl />
              <UserControl />
            </>
          ) : (
            <>
              <Button variant="plain" color="neutral" onClick={() => navigate('/login')}>
                登录
              </Button>
              <Button variant="plain" color="neutral" onClick={() => navigate('/register')}>
                注册
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Container>
    </Box>
  )
}

const UserControl = memo(() => {
  const { user } = useUser()
  const { logOut } = useSession()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])
  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  return (
    <>
      <IconButton onClick={handleClick} variant="plain" color="neutral">
        <Person />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} placement="bottom-end">
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, pt: 0 }}>
          {user ? (
            <Typography level="h6" sx={{ flexGrow: 1 }}>
              {user.email}
            </Typography>
          ) : (
            <CircularProgress size="sm" sx={{ flexGrow: 1 }} />
          )}
          <IconButton color="danger" size="sm">
            <ExitToApp fontSize="small" onClick={logOut} />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <NormalMenuButton Icon={AccountCircle} text="个人信息" />
        <NormalMenuButton Icon={Notifications} text="通知" />
        <Divider sx={{ my: 1 }} />
        <NormalMenuButton Icon={ViewInAr} text="模型库" />
        <NormalMenuButton Icon={Task} text="任务管理" />
        <NormalMenuButton Icon={Cloud} text="文件管理" />
      </Menu>
    </>
  )
})

const MessageControl = memo(() => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])
  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  return (
    <>
      <IconButton onClick={handleClick} variant="plain" color="neutral">
        <Notifications />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        placement="bottom-end"
        sx={{
          minWidth: 300,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, pt: 0 }}>
          <Typography level="h6" sx={{ flexGrow: 1 }}>
            消息中心
          </Typography>
          <IconButton color="danger" size="sm">
            <DeleteSweep fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <MenuItem>暂无消息</MenuItem>
      </Menu>
    </>
  )
})
