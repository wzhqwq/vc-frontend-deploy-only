import SaveIcon from '@mui/icons-material/Save'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'

import { Stack, Button, Box } from '@mui/joy'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { UseFormReturn, useFormContext } from 'react-hook-form'
import { Fade } from '@mui/material'
import { SxProps } from '@mui/joy/styles/types'

export interface MutationControllerProps {
  saveText?: string
  onChange?: (data: any) => void
  saving?: boolean
  readonly?: boolean
  children?: React.ReactNode
  methods?: UseFormReturn<any>
}

export default function MutationController({
  saveText = '保存',
  saving,
  onChange,
  readonly = false,
  children,
  methods,
}: MutationControllerProps) {
  const {
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useFormContext() ?? methods ?? {}

  const [containerWidth, setContainerWidth] = useState(0)
  const controllerRef = useRef<HTMLDivElement>(null)
  const restRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)
  const containerHeightRef = useRef(0)

  const containerStyle = useMemo(
    () =>
      (containerWidth > 0
        ? {
            position: 'relative',
            width: containerWidth,
            height: containerHeightRef.current,
            transition: 'width 0.3s',
            '>.MuiStack-root': {
              position: 'absolute',
              '>.MuiStack-root': {
                flexShrink: 0,
              },
            },
            overflow: 'hidden',
          }
        : {
            position: 'relative',
            overflow: 'hidden',
          }) as SxProps,
    [containerWidth],
  )

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  useEffect(() => {
    if (isDirty) {
      if (!readonly && controllerRef.current) setContainerWidth(controllerRef.current.offsetWidth)
      return
    }
    if (restRef.current) setContainerWidth(restRef.current.offsetWidth)
  })
  useEffect(() => {
    if (controllerRef.current) {
      containerHeightRef.current = controllerRef.current.clientHeight
    }
  }, [])

  const onSave = useCallback(() => {
    if (!onChangeRef.current) return
    handleSubmit(onChangeRef.current)
  }, [handleSubmit])

  return (
    <Box sx={containerStyle}>
      <Fade in={!readonly && isDirty}>
        <Stack direction="row">
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ '.MuiButton-root': { flexShrink: 0 } }}
            ref={controllerRef}
          >
            <Button
              variant="solid"
              startDecorator={<SaveIcon />}
              color="primary"
              onClick={onSave}
              disabled={!isValid || saving}
              loading={saving}
            >
              {saveText}
            </Button>
            <Button
              variant="soft"
              startDecorator={<ReplayRoundedIcon />}
              color="primary"
              onClick={() => reset()}
            >
              重置
            </Button>
          </Stack>
        </Stack>
      </Fade>
      {children && (
        <Fade in={!isDirty}>
          <Stack direction="row">
            <Stack direction="row" alignItems="center" ref={restRef}>
              {children}
            </Stack>
          </Stack>
        </Fade>
      )}
    </Box>
  )
}
