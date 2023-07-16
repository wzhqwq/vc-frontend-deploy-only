import { useTask } from '@/api/task'
import {
  Button,
  Divider,
  Modal,
  ModalDialog,
  Stack,
  Tab,
  TabList,
  Tabs,
  Typography,
} from '@mui/joy'
import { useState } from 'react'
import { useController } from 'react-hook-form'
import Datasets from '../cards/Datasets'

export default function DatasetInput({ name }: { name: string }) {
  const {
    field: { value, onChange },
  } = useController({ name })
  const { task_id, title } = value
  const { task } = useTask(task_id)
  const [openDatasets, setOpenDatasets] = useState(false)
  const [showPublic, setShowPublic] = useState(false)

  return (
    <>
      {task && (
        <Stack direction="row" spacing={2}>
          <Typography level="body2" color="neutral">
            数据集名称：
          </Typography>
          <Typography level="body2">{title}</Typography>
        </Stack>
      )}
      <Button fullWidth onClick={() => setOpenDatasets(true)}>
        {task_id ? '修改数据集' : '选择数据集'}
      </Button>
      <Modal open={openDatasets} onClose={() => setOpenDatasets(false)}>
        <ModalDialog sx={{ p: 2 }}>
          <Tabs onChange={(_, v) => setShowPublic(v == 1)} value={showPublic ? 1 : 0}>
            <TabList>
              <Tab value={0}>我的模型</Tab>
              <Tab value={1}>公开模型</Tab>
            </TabList>
          </Tabs>
          <Divider sx={{ my: 2, mx: -2 }} />
          <Datasets
            isPublic={showPublic}
            onSelect={({ task_id, title }) => {
              onChange({ task_id, title })
              setOpenDatasets(false)
            }}
          />
        </ModalDialog>
      </Modal>
    </>
  )
}
