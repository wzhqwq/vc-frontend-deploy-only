import { LinkProps as RouterLinkProps, useHref, useLinkClickHandler } from 'react-router-dom'
import { ListItemButton, ListItemButtonProps } from '@mui/joy'
import { forwardRef } from 'react'

export type InnerLinkListItemButtonProps = Omit<ListItemButtonProps, 'href'> & RouterLinkProps

const InnerLinkListItemButton = forwardRef<HTMLAnchorElement, InnerLinkListItemButtonProps>(
  ({ onClick, replace = false, state, target, to, sx, ...rest }, ref) => {
    let href = useHref(to)
    let handleClick = useLinkClickHandler(to, {
      replace,
      state,
      target,
    })

    return (
      <ListItemButton
        component="a"
        {...rest}
        href={href}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            handleClick(event)
          }
        }}
        ref={ref}
        target={target}
        sx={{
          ...sx,
          boxSizing: 'border-box',
        }}
      />
    )
  },
)
export default InnerLinkListItemButton
