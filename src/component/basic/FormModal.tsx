import { DictConfigParameter } from '@/types/config/parameter'
import { Box, Button, Modal, ModalDialog, Stack, Typography } from '@mui/joy'
import { useEffect, useMemo, useState } from 'react'
import ParameterInput from './ParameterInput'
import { FormProvider, useController, useForm } from 'react-hook-form'
import { Fade } from '@mui/material'

export interface FormModalProps {
  name: string
  parameter: DictConfigParameter<any, any>
  readonly?: boolean
}

export default function FormModal({
  name,
  parameter: { properties, key },
  readonly,
}: FormModalProps) {
  const [open, setOpen] = useState(false)

  const {
    field: { value, onChange },
  } = useController({ name })
  const methods = useForm<{ dict: any }>()
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

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" sx={{ my: 0.5 }} fullWidth>
        {readonly ? '点击查看' : '点击编辑'}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
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
              {!readonly && (
                <Fade in={methods.formState.isDirty}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      onClick={(e) =>
                        methods
                          .handleSubmit((data) => onChange(data.dict))(e)
                          .then(() => {
                            setOpen(false)
                          })
                      }
                      disabled={!methods.formState.isValid}
                    >
                      <Box sx={{ flexShrink: 0 }}>保存</Box>
                    </Button>
                    <Button
                      onClick={() => {
                        methods.reset()
                      }}
                      variant="soft"
                    >
                      <Box sx={{ flexShrink: 0 }}>重置</Box>
                    </Button>
                  </Stack>
                </Fade>
              )}
              <Button onClick={() => setOpen(false)} variant="soft" color="neutral">
                关闭
              </Button>
            </Stack>
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  )
}
