import { DictConfigParameter } from '@/types/config/parameter'
import { Box, Button, Modal, ModalDialog, Stack, Typography } from '@mui/joy'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ParameterInput from './ParameterInput'
import { FormProvider, useForm } from 'react-hook-form'
import MutationController from '../MutationController'

export interface FormModalProps {
  parameter: DictConfigParameter<any, any>
  readonly?: boolean
  value: any
  onChange?: (value: any) => void
  onBlur?: () => void
}

export default function FormModal({
  parameter: { properties, key },
  readonly,
  value,
  onChange,
  onBlur,
}: FormModalProps) {
  const [open, setOpen] = useState(false)

  const methods = useForm<{ dict: any }>({ mode: 'onBlur' })
  const columns = properties.length > 3 ? Math.max(2, properties.length / 3).toFixed(0) : 1
  const parameterList = useMemo(
    () =>
      properties.map((parameter) => (
        <ParameterInput key={parameter.key as string} parameter={parameter} prefix="dict" />
      )),
    [properties],
  )

  useEffect(() => {
    methods.reset({ dict: value })
  }, [value])
  const handleChange = useCallback(
    (data: { dict: any }) => {
      onChange?.(data.dict)
    },
    [onChange],
  )
  const handleClose = useCallback(() => {
    onBlur?.()
    setOpen(false)
  }, [onBlur])

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" sx={{ my: 0.5 }} fullWidth>
        {readonly ? '点击查看' : '点击编辑'}
      </Button>
      <Modal
        open={open}
        onClose={() => {
          onBlur?.()
          setOpen(false)
        }}
      >
        <ModalDialog sx={{ p: 2, minWidth: 200 }}>
          <Typography level="h5" sx={{ mb: 2 }}>
            编辑{key}字典
          </Typography>
          <FormProvider {...methods}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 240px)`,
                gap: 2,
              }}
            >
              {parameterList}
            </Box>
            <Stack direction="row" mt={2} spacing={2}>
              <Box sx={{ flexGrow: 1 }} />
              <MutationController onChange={handleChange} readonly={readonly}>
                <Button onClick={handleClose} variant="soft" color="neutral">
                  关闭
                </Button>
              </MutationController>
            </Stack>
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  )
}
