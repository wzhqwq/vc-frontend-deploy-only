import { Button, Modal, ModalDialog, Stack } from '@mui/joy'
import { useState } from 'react'
import { LayerGraphEditor } from '../visualization/svgEditors'

export interface ModelInputProps {
  value: string
  onChange: (value: string) => void
  readonly?: boolean
}
export function ModelInput({ value, onChange, readonly }: ModelInputProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Stack direction="row" spacing={2} sx={{ my: 1, justifyContent: 'center' }}>
        <Button size="sm" onClick={() => !readonly && setOpen(true)}>
          编辑模型
        </Button>
        <Button size="sm">导入模型</Button>
      </Stack>
      <Modal open={open}>
        <ModalDialog layout="fullscreen">
          <LayerGraphEditor filename={value} onSave={onChange} onClose={() => setOpen(false)} />
        </ModalDialog>
      </Modal>
    </>
  )
}
