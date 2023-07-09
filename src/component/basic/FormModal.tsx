import { ConfigParameterArray, EachTypeOfConfigParameter } from '@/types/config/parameter'
import { Box, Button, FormLabel, Modal, ModalDialog, Stack } from '@mui/joy'
import { useMemo, useState } from 'react'
import { Control } from 'react-hook-form'
import ParameterInput from './ParameterInput'

import CheckIcon from '@mui/icons-material/Check'

export interface FormModalProps {
  control: Control<any>
  name: string
  parameters: ConfigParameterArray<any>
  label: string
  description: string
}

export default function FormModal(props: FormModalProps) {
  const [open, setOpen] = useState(false)

  const columns = Math.max(2, props.parameters.length / 3).toFixed(0)
  const parameterList = useMemo(
    () =>
      props.parameters.map((parameter) => (
        <ParameterInput
          key={parameter.key as string}
          parameter={parameter}
          control={props.control}
          prefix={props.name}
        />
      )),
    [props.parameters],
  )

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <FormLabel>{props.description}</FormLabel>
        <Button onClick={() => setOpen(true)}>详情</Button>
      </Stack>
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
