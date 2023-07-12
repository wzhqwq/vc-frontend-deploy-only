import { DictConfigParameter } from '@/types/config/parameter'
import { Box, Button, Modal, ModalDialog } from '@mui/joy'
import { useMemo, useState } from 'react'
import ParameterInput from './ParameterInput'

export interface FormModalProps {
  name: string
  parameter: DictConfigParameter<any, any>
  readonly?: boolean
}

export default function FormModal({ name, parameter: { properties }, readonly }: FormModalProps) {
  const [open, setOpen] = useState(false)

  const columns = properties.length > 3 ? Math.max(2, properties.length / 3).toFixed(0) : 1
  const parameterList = useMemo(
    () =>
      properties.map((parameter) => (
        <ParameterInput key={parameter.key as string} parameter={parameter} prefix={name} />
      )),
    [properties],
  )

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" sx={{ my: 0.5 }} fullWidth>
        {readonly ? '点击查看' : '点击编辑'}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog sx={{ p: 2, minWidth: 200 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 240px)`,
              gap: 2,
            }}
          >
            {parameterList}
          </Box>
        </ModalDialog>
      </Modal>
    </>
  )
}
