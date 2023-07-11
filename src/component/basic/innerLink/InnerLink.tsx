import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'
import { Link as JoyLink, LinkProps as JoyLinkProps } from '@mui/joy'

export type InnerLinkProps = Omit<JoyLinkProps, 'href'> & RouterLinkProps

export default function InnerLink(props: InnerLinkProps) {
  return <JoyLink component={RouterLink} {...props} />
}
