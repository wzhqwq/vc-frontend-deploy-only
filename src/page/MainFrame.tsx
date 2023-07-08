import AccountCircle from '@mui/icons-material/AccountCircle'
import DeleteSweep from '@mui/icons-material/DeleteSweep'
import ExitToApp from '@mui/icons-material/ExitToApp'
import ExploreTwoTone from '@mui/icons-material/ExploreTwoTone'
import HelpTwoTone from '@mui/icons-material/HelpTwoTone'
import InfoTwoTone from '@mui/icons-material/InfoTwoTone'
import Notifications from '@mui/icons-material/Notifications'
import Person from '@mui/icons-material/Person'
import Task from '@mui/icons-material/Task'
import TaskTwoTone from '@mui/icons-material/TaskTwoTone'
import ViewInAr from '@mui/icons-material/ViewInAr'
import AccountTree from '@mui/icons-material/AccountTree'
import Description from '@mui/icons-material/Description'

import { useSession, useUser } from '@/api/user'
import { SearchInput } from '@/component/basic/CustomInput'
import { NormalMenuButton } from '@/component/basic/CustomMenu'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
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
    <Stack
      sx={{
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
          <Button variant="plain" color="neutral" onClick={() => navigate('/explore/projects')}>
            <ExploreTwoTone fontSize="small" sx={{ mr: 1 }} />
            探索
          </Button>
          <Button variant="plain" color="neutral" onClick={() => navigate('/tasks')}>
            <TaskTwoTone fontSize="small" sx={{ mr: 1 }} />
            公开任务
          </Button>
          <Button variant="plain" color="neutral" onClick={() => navigate('/guide')}>
            <HelpTwoTone fontSize="small" sx={{ mr: 1 }} />
            指引
          </Button>
          <Button variant="plain" color="neutral" onClick={() => navigate('/about')}>
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
    </Stack>
  )
}

const UserControl = memo(() => {
  const { user } = useUser()
  const { logOut } = useSession()

  const navigate = useNavigate()

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
        <Stack direction="row" p={1} pt={0} spacing={2} alignItems="center">
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
        </Stack>
        <Divider sx={{ mb: 1 }} />
        <NormalMenuButton
          Icon={AccountCircle}
          text="个人信息"
          onClick={() => navigate('/user/profile')}
        />
        <NormalMenuButton
          Icon={Notifications}
          text="通知"
          onClick={() => navigate('/user/notifications')}
        />
        <Divider sx={{ my: 1 }} />
        <Typography level="body2" color="neutral" sx={{ px: 2, pb: 1 }}>
          个人数据
        </Typography>
        <NormalMenuButton
          Icon={ViewInAr}
          text="算法模型"
          onClick={() => navigate('/user/models')}
        />
        <NormalMenuButton
          Icon={Description}
          text="数据集"
          onClick={() => navigate('/user/datasets')}
        />
        <NormalMenuButton
          Icon={AccountTree}
          text="项目"
          onClick={() => navigate('/user/projects')}
        />
        <NormalMenuButton Icon={Task} text="任务管理" onClick={() => navigate('/user/tasks')} />
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
        <Stack direction="row" alignItems="center" p={1} pt={0}>
          <Typography level="h6" sx={{ flexGrow: 1 }}>
            消息中心
          </Typography>
          <IconButton color="danger" size="sm">
            <DeleteSweep fontSize="small" />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 1 }} />
        <MenuItem>暂无消息</MenuItem>
      </Menu>
    </>
  )
})
