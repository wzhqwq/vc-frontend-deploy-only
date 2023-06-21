import { SearchInput } from '@/component/basic/CustomInput'
import { NormalMenuButton } from '@/component/basic/CustomMenu'
import {
  AccountCircle,
  Cloud,
  DeleteSweep,
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
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/joy'
import { AppBar, Toolbar } from '@mui/material'
import { memo, useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'

export function MainFrame() {
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
          <Typography level="h6" component="div" sx={{ mr: 1 }}>
            多模态可视化平台
          </Typography>
          <SearchInput />
          <Button variant='plain' color='neutral'>
            <ExploreTwoTone fontSize="small" sx={{ mr: 1 }} />
            探索
          </Button>
          <Button variant='plain' color='neutral'>
            <TaskTwoTone fontSize="small" sx={{ mr: 1 }} />
            公开任务
          </Button>
          <Button variant='plain' color='neutral'>
            <HelpTwoTone fontSize="small" sx={{ mr: 1 }} />
            指引
          </Button>
          <Button variant='plain' color='neutral'>
            <InfoTwoTone fontSize="small" sx={{ mr: 1 }} />
            关于
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <MessageControl />
          <UserControl />
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
      <IconButton onClick={handleClick} variant='plain' color='neutral'>
        <Person />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        placement='bottom-end'
      >
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
      <IconButton onClick={handleClick} variant='plain' color='neutral'>
        <Notifications />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        placement='bottom-end'
        sx={{
          minWidth: 300,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1 }}>
          <Typography level="h6" sx={{ flexGrow: 1 }}>消息中心</Typography>
          <IconButton color="danger">
            <DeleteSweep />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <MenuItem>
          暂无消息
        </MenuItem>
      </Menu>
    </>
  )
})
