import { Button, Divider, Modal, ModalDialog, Stack, Tab, TabList, Tabs } from '@mui/joy'
import { useState } from 'react'
import { LayerGraphEditor } from '@/component/visualization/svgEditors'
import Models from '@/component/cards/Models'

export interface ModelInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  readonly?: boolean
}
export function ModelInput({ value, onChange, onBlur, readonly }: ModelInputProps) {
  const [open, setOpen] = useState(false)
  const [openModels, setOpenModels] = useState(false)
  const [showPublic, setShowPublic] = useState(false)
  return (
    <>
      <Stack direction="row" spacing={2} sx={{ my: 1, justifyContent: 'center' }}>
        <Button size="sm" onClick={() => setOpen(true)}>
          {readonly ? '查看模型' : '编辑模型'}
        </Button>
        {!readonly && (
          <Button size="sm" onClick={() => setOpenModels(true)}>
            使用现有模型
          </Button>
        )}
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
      <Modal open={openModels} onClose={() => setOpenModels(false)}>
        <ModalDialog sx={{ p: 2, minWidth: 400 }}>
          <Tabs onChange={(_, v) => setShowPublic(v == 1)} value={showPublic ? 1 : 0}>
            <TabList>
              <Tab value={0}>我的模型</Tab>
              <Tab value={1}>公开模型</Tab>
            </TabList>
          </Tabs>
          <Divider sx={{ my: 2, mx: -2 }} />
          <Models
            isPublic={showPublic}
            onSelect={({ filename }) => {
              onChange(filename)
              setOpenModels(false)
            }}
          />
        </ModalDialog>
      </Modal>
    </>
  )
}
