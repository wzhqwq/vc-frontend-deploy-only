import { SearchRounded } from '@mui/icons-material'
import { Input, InputProps } from '@mui/joy'

export const SearchInput = (props: InputProps) => (
  <Input {...props} variant="soft" startDecorator={<SearchRounded />} />
)
