import AccessTimeIcon from '@mui/icons-material/AccessTime'

import { useDatasets } from '@/api/dataset'
import { SearchInput } from '@/component/basic/CustomInput'
import { UserWidget } from '@/component/basic/getters'
import { formatDate } from '@/utils/time'
import { Box, Card, CircularProgress, Grid, Link, Stack, Typography } from '@mui/joy'
import InnerLink from '../basic/innerLink/InnerLink'
import { useState } from 'react'
import { Dataset } from '@/types/entity/dataset'

interface DatasetsProps {
  isPublic: boolean
  onSelect?: (dataset: Dataset) => void
}
export default function Datasets({ isPublic, onSelect }: DatasetsProps) {
  const [search, setSearch] = useState('')
  const { datasets, fetchingDatasets } = useDatasets(isPublic, search)

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <SearchInput placeholder="搜索数据集" value={search} onChange={setSearch} />
      </Stack>
      {fetchingDatasets && <CircularProgress sx={{ mx: 'auto', mt: 2, display: 'block' }} />}
      <Grid container spacing={2} py={2}>
        {datasets?.map((dataset) => (
          <Grid sm={12} md={onSelect ? 12 : 6} key={dataset.id}>
            <Card variant="outlined">
              <div>
                <Typography level="h5">
                  {onSelect ? (
                    <Link overlay underline="none" onClick={() => onSelect(dataset)} href="#">
                      {dataset.title}
                    </Link>
                  ) : (
                    <InnerLink overlay to={`/dataset/${dataset.id}`} underline="none">
                      {dataset.title}
                    </InnerLink>
                  )}
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
