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
  ViewInAr,
} from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItem,
  Menu,
  Toolbar,
  Typography,
} from '@mui/material'
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
          <Typography variant="h6" component="div" sx={{ mr: 1 }}>
            多模态可视化平台
          </Typography>
          <SearchInput />
          <Button color="inherit">
            <ExploreTwoTone fontSize="small" sx={{ mr: 1 }} />
            探索
          </Button>
          <Button color="inherit">
            <HelpTwoTone fontSize="small" sx={{ mr: 1 }} />
            指引
          </Button>
          <Button color="inherit">
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
      <IconButton color="inherit" edge="end" onClick={handleClick}>
        <Person />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          dense: true,
        }}
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
      <IconButton color="inherit" onClick={handleClick}>
        <Notifications />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          dense: true,
          sx: {
            width: 300,
          },
        }}
      >
        <ListItem secondaryAction={
          <IconButton color="error">
            <DeleteSweep />
          </IconButton>
        }>
          <Typography variant="h6">消息中心</Typography>
        </ListItem>
        <Divider sx={{ my: 1 }} />
      </Menu>
    </>
  )
})
