import { MenuItem, ListItemDecorator } from '@mui/joy'
import SvgIcon from '@mui/material/SvgIcon'
import { memo } from 'react'

type SvgIconComponent = typeof SvgIcon

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
