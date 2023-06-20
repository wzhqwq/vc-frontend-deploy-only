import { SearchRounded } from '@mui/icons-material'
import { InputBase, InputBaseProps, styled } from '@mui/material'

export const TranslucentInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'box-shadow']),
  padding: theme.spacing(0.5, 1),
  '&:focus-within': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    boxShadow: `0 2px 2px ${theme.palette.primary.main}`,
  },
  '.MuiInputBase-input': {
    color: 'white',
    padding: theme.spacing(0.5, 1),
  },
}))

export const SearchInput = (props: InputBaseProps) => (
  <TranslucentInput {...props} startAdornment={<SearchRounded sx={{ color: 'white' }} />} />
)
