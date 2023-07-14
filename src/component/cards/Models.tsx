import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AddIcon from '@mui/icons-material/Add'

import { useModels } from '@/api/model'
import { SearchInput } from '@/component/basic/CustomInput'
import { UserWidget } from '@/component/basic/getters'
import { formatDate } from '@/utils/time'
import { Box, Button, Card, CircularProgress, Grid, Stack, Typography } from '@mui/joy'
import InnerLink from '../basic/innerLink/InnerLink'
import { modelKinds } from '../basic/chips'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Models({ isPublic }: { isPublic: boolean }) {
  const [search, setSearch] = useState('')
  const { models, fetchingModels } = useModels(isPublic, search)
  const navigate = useNavigate()

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <SearchInput placeholder="搜索算法" sx={{ flexGrow: 1 }} value={search} onChange={setSearch} />
        <Button variant="solid" onClick={() => navigate('/model/new')} startDecorator={<AddIcon />}>
          创建算法
        </Button>
      </Stack>
      {fetchingModels && <CircularProgress sx={{ mx: 'auto', mt: 2, display: 'block' }} />}
      <Grid container spacing={2} py={2}>
        {models?.map((model) => (
          <Grid sm={12} md={6} key={model.id}>
            <Card variant="outlined">
              <div>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {modelKinds[model.kind]}
                  <Typography level="h5">
                    <InnerLink overlay to={`/model/${model.id}`} underline="none">
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
