import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { useDataset } from '@/api/dataset'
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { FakeParagraph } from '@/utils/fake'
import { UserWidget } from '@/component/basic/getters'
import { formatTime } from '@/utils/time'
import { useUser } from '@/api/user'
import InnerLinkButton from '@/component/basic/innerLink/InnerLinkButton'
import { download } from '@/utils/action'
import { useTask } from '@/api/task'
import { BasicResult } from '@/types/config/project'

export default function ViewDataset() {
  const { id: datasetId } = useParams<{ id: string }>()
  const { dataset, fetchingDataset, deleteDataset, deletingDataset } = useDataset(Number(datasetId))
  const { task, fetchingTask } = useTask(dataset?.task_id)
  const { user } = useUser()
  const isOwner = !!user && user.id === dataset?.user_id

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {fetchingDataset && <Skeleton variant="text" sx={{ fontSize: '2rem', width: 100 }} />}
        {dataset && (
          <>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography component="div" level="h6">
                <UserWidget userId={dataset.user_id} />
              </Typography>
              <ChevronRightIcon color="secondary" />
              <Typography component="div" level="h4">
                {dataset.title}
              </Typography>
              <Chip variant="outlined" size="sm">
                {dataset.private ? '私有' : '公开'}
              </Chip>
              <Divider orientation="vertical" />
              <Box>
                <Typography level="body2">创建时间</Typography>
                <Typography level="body1">{formatTime(dataset.created_at)}</Typography>
              </Box>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            {isOwner && (
              <>
                <Button
                  color="danger"
                  variant="soft"
                  startDecorator={<DeleteIcon />}
                  onClick={deleteDataset}
                  disabled={deletingDataset}
                  loading={deletingDataset}
                >
                  删除数据集
                </Button>
                <InnerLinkButton
                  component="a"
                  color="primary"
                  variant="soft"
                  startDecorator={<EditIcon />}
                  to={`/dataset/${datasetId}/edit`}
                >
                  编辑数据集
                </InnerLinkButton>
              </>
            )}
          </>
        )}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid sm={12} md={9}>
          {(fetchingDataset || fetchingTask) && (
            <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />
          )}
          {task?.result && (
            <Button
              variant="soft"
              onClick={() =>
                download(
                  (task.result as BasicResult).filename,
                  (task.result as BasicResult).extension,
                )
              }
            >
              下载数据集
            </Button>
          )}
        </Grid>
        <Grid sm={12} md={3}>
          <Stack spacing={2}>
            <Card variant="soft">
              <Typography level="h5" gutterBottom>
                数据集描述
              </Typography>
              {dataset && <Typography level="body1">{dataset.description}</Typography>}
              {fetchingDataset && <FakeParagraph />}
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
