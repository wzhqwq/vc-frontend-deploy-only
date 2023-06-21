import { SvgIconComponent } from '@mui/icons-material'
import { MenuItem, ListItemDecorator } from '@mui/joy'
import { memo } from 'react'

interface CustomMenuProps {
  Icon: SvgIconComponent
  text: string
  onClick?: () => void
}

export const NormalMenuButton = memo(({ Icon, text, onClick }: CustomMenuProps) => (
  <MenuItem onClick={onClick}>
    <ListItemDecorator sx={{ minWidth: '32px' }}>
      <Icon fontSize="small" />
    </ListItemDecorator>
    {text}
  </MenuItem>
))
