import { SvgIconComponent } from '@mui/icons-material'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { memo } from 'react'

interface CustomMenuProps {
  Icon: SvgIconComponent
  text: string
  onClick?: () => void
}

export const NormalMenuButton = memo(({ Icon, text, onClick }: CustomMenuProps) => (
  <ListItemButton onClick={onClick}>
    <ListItemIcon sx={{ minWidth: '32px' }}>
      <Icon fontSize="small" />
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItemButton>
))
