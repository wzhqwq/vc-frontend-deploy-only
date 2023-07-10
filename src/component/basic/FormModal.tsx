import { ConfigParameterArray } from '@/types/config/parameter'
import { Box, Button, Modal, ModalDialog } from '@mui/joy'
import { useMemo, useState } from 'react'
import ParameterInput from './ParameterInput'

export interface FormModalProps {
  name: string
  parameters: ConfigParameterArray<any>
}

export default function FormModal({ name, parameters }: FormModalProps) {
  const [open, setOpen] = useState(false)

  const columns = Math.max(2, parameters.length / 3).toFixed(0)
  const parameterList = useMemo(
    () =>
      parameters.map((parameter) => (
        <ParameterInput key={parameter.key as string} parameter={parameter} prefix={name} />
      )),
    [parameters],
  )

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" sx={{ my: 0.5 }}>
        点击编辑
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog sx={{ p: 2, minWidth: 200 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 200px)`,
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
