import { DictConfigParameter } from '@/types/config/parameter'
import { Box, Button, Modal, ModalDialog, Stack, Typography } from '@mui/joy'
import { useMemo, useState } from 'react'
import ParameterInput from './ParameterInput'
import { FormProvider, useController, useForm, useFormContext, useFormState } from 'react-hook-form'
import { Collapse } from '@mui/material'

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
  const methods = useForm<{ dict: any }>({ values: { dict: value } })
  const columns = properties.length > 3 ? Math.max(2, properties.length / 3).toFixed(0) : 1
  const parameterList = useMemo(
    () =>
      properties.map((parameter) => (
        <ParameterInput key={parameter.key as string} parameter={parameter} prefix="dict" />
      )),
    [properties],
  )
  console.log('render', properties)

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
            <Stack direction="row" mt={2}>
              <Box sx={{ flexGrow: 1 }} />
              <Button onClick={() => setOpen(false)} variant="soft" color="neutral">
                关闭
              </Button>
              {!readonly && <SaveIndicator onChange={onChange} onClose={() => setOpen(false)} />}
            </Stack>
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  )
}

function SaveIndicator({
  onChange,
  onClose,
}: {
  onChange: (value: any) => void
  onClose: () => void
}) {
  const { isDirty, isValid } = useFormState()
  const { handleSubmit } = useFormContext()
  return (
    <Collapse in={isDirty} orientation="horizontal">
      <Button
        onClick={(e) =>
          handleSubmit((data) => onChange(data.dict))(e).then(() => {
            onClose()
          })
        }
        disabled={!isValid}
        variant="soft"
        sx={{ ml: 2 }}
      >
        <Box sx={{ flexShrink: 0 }}>保存</Box>
      </Button>
    </Collapse>
  )
}
