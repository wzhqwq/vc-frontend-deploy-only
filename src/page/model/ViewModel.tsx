import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { useModel } from '@/api/model'
import { Box, Button, Card, Chip, Divider, Grid, Stack, Typography } from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { FakeParagraph } from '@/utils/fake'
import { UserWidget } from '@/component/basic/getters'
import { formatTime } from '@/utils/time'
import { useUser } from '@/api/user'
import InnerLinkButton from '@/component/basic/innerLink/InnerLinkButton'
import { LayerGraphEditor } from '@/component/visualization/svgEditors'
import { useFileInfoById } from '@/api/files'

export default function ViewModel() {
  const { id: modelId } = useParams<{ id: string }>()
  const { model, fetchingModel, deleteModel, deletingModel } = useModel(Number(modelId))
  const { user } = useUser()
  const isOwner = !!user && user.id === model?.user_id

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {fetchingModel && <Skeleton variant="text" sx={{ fontSize: '2rem', width: 100 }} />}
        {model && (
          <>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography component="div" level="h6">
                <UserWidget userId={model.user_id} />
              </Typography>
              <ChevronRightIcon color="secondary" />
              <Typography component="div" level="h4">
                {model.title}
              </Typography>
              <Chip variant="outlined" size="sm">
                {model.private ? '私有' : '公开'}
              </Chip>
              <Divider orientation="vertical" />
              <Box>
                <Typography level="body2">创建时间</Typography>
                <Typography level="body1">{formatTime(model.created_at)}</Typography>
              </Box>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            {isOwner && (
              <>
                <Button
                  color="danger"
                  variant="soft"
                  startDecorator={<DeleteIcon />}
                  onClick={deleteModel}
                  disabled={deletingModel}
                  loading={deletingModel}
                >
                  删除算法
                </Button>
                <InnerLinkButton
                  component="a"
                  color="primary"
                  variant="soft"
                  startDecorator={<EditIcon />}
                  to={`/model/${modelId}/edit`}
                >
                  编辑算法
                </InnerLinkButton>
              </>
            )}
          </>
        )}
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid sm={12} md={9}>
          {fetchingModel && <Skeleton variant="rounded" width="100%" height={300} />}
          {model && <LayerGraphEditor filename={model.filename} readonly />}
        </Grid>
        <Grid sm={12} md={3}>
          <Stack spacing={2}>
            <Card variant="soft">
              <Typography level="h5" gutterBottom>
                算法描述
              </Typography>
              {model && <Typography level="body1">{model.description}</Typography>}
              {fetchingModel && <FakeParagraph />}
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
