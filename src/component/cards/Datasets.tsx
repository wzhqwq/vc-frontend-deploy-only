import { useDatasets } from '@/api/dataset'
import { SearchInput } from '@/component/basic/CustomInput'
import { UserWidget } from '@/component/basic/getters'
import { formatDate } from '@/utils/time'
import { Box, Card, CircularProgress, Grid, Stack, Typography } from '@mui/joy'
import InnerLink from '../basic/innerLink/InnerLink'

import AccessTimeIcon from '@mui/icons-material/AccessTime'

export default function Datasets({ isPublic }: { isPublic: boolean }) {
  const { datasets, fetchingDatasets } = useDatasets(isPublic)

  return (
    <Box>
      <SearchInput placeholder="搜索数据集" />
      {fetchingDatasets && <CircularProgress sx={{ mx: 'auto', mt: 2, display: 'block' }} />}
      <Grid container spacing={2} py={2}>
        {datasets?.map((dataset) => (
          <Grid sm={12} md={6} key={dataset.id}>
            <Card variant="outlined">
              <div>
                <Typography level="h5">
                  <InnerLink overlay to={`/datasets/${dataset.id}`} underline='none'>
                    {dataset.title}
                  </InnerLink>
                </Typography>
                <Typography level="body2">{dataset.description || '暂无描述'}</Typography>
              </div>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Typography level="body2" component="div">
                  <UserWidget userId={dataset.user_id} />
                </Typography>
                <Typography level="body2" component="div">
                  <Stack direction="row" alignItems="center" spacing={0.5} useFlexGap>
                    <AccessTimeIcon />
                    {formatDate(dataset.created_at)}
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
