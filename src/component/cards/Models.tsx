import { useModels } from '@/api/model'
import { SearchInput } from '@/component/basic/CustomInput'
import { UserWidget } from '@/component/basic/getters'
import { formatDate } from '@/utils/time'
import { Box, Card, CircularProgress, Grid, Stack, Typography } from '@mui/joy'
import InnerLink from '../basic/innerLink/InnerLink'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { modelKinds } from '../basic/chips'

export default function Models({ isPublic }: { isPublic: boolean }) {
  const { models, fetchingModels } = useModels(isPublic)

  return (
    <Box>
      <SearchInput placeholder="搜索数据集" />
      {fetchingModels && <CircularProgress sx={{ mx: 'auto', mt: 2, display: 'block' }} />}
      <Grid container spacing={2} py={2}>
        {models?.map((model) => (
          <Grid sm={12} md={6} key={model.id}>
            <Card variant="outlined">
              <div>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {modelKinds[model.kind]}
                  <Typography level="h5">
                    <InnerLink overlay to={`/models/${model.id}`} underline='none'>
                      {model.title}
                    </InnerLink>
                  </Typography>
                </Stack>
                <Typography level="body2">{model.description || '暂无描述'}</Typography>
              </div>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Typography level="body2" component="div">
                  <UserWidget userId={model.user_id} />
                </Typography>
                <Typography level="body2" component="div">
                  <Stack direction="row" alignItems="center" spacing={0.5} useFlexGap>
                    <AccessTimeIcon />
                    {formatDate(model.created_at)}
                  </Stack>
                </Typography>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
