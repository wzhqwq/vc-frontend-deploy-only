import { Button, Modal, ModalDialog, Stack } from '@mui/joy'
import { useState } from 'react'
import { LayerGraphEditor } from '../visualization/svgEditors'

export interface ModelInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  readonly?: boolean
}
export function ModelInput({ value, onChange, onBlur, readonly }: ModelInputProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Stack direction="row" spacing={2} sx={{ my: 1, justifyContent: 'center' }}>
        <Button size="sm" onClick={() => setOpen(true)}>
          {readonly ? '查看模型' : '编辑模型'}
        </Button>
        {!readonly && <Button size="sm">使用现有模型</Button>}
      </Stack>
      <Modal open={open}>
        <ModalDialog layout="fullscreen" sx={{ p: 0 }}>
          <LayerGraphEditor
            filename={value}
            onSave={onChange}
            onClose={() => {
              setOpen(false)
              onBlur?.()
            }}
            readonly={readonly}
          />
        </ModalDialog>
      </Modal>
    </>
  )
}
