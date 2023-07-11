import { LinkProps as RouterLinkProps, useHref, useLinkClickHandler } from 'react-router-dom'
import { Button, ButtonProps } from '@mui/joy'
import { forwardRef } from 'react'

export type InnerLinkButtonProps = Omit<ButtonProps, 'href'> & RouterLinkProps

const InnerLinkButton = forwardRef<HTMLAnchorElement, InnerLinkButtonProps>(
  ({ onClick, replace = false, state, target, to, sx, ...rest }, ref) => {
    let href = useHref(to)
    let handleClick = useLinkClickHandler(to, {
      replace,
      state,
      target,
    })

    return (
      <Button
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
export default InnerLinkButton
