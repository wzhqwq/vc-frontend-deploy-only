import { Skeleton } from '@mui/material'
import { memo } from 'react'

export const FakeParagraph = memo(() => {
  return (
    <>
      {new Array(5).fill(0).map((_, i) => (
        <Skeleton key={i} variant="text" animation="wave" />
      ))}
    </>
  )
})
