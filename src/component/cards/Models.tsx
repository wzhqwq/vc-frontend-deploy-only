import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AddIcon from '@mui/icons-material/Add'

import { useModels } from '@/api/model'
import { SearchInput } from '@/component/basic/CustomInput'
import { UserWidget } from '@/component/basic/getters'
import { formatDate } from '@/utils/time'
import { Box, Card, CircularProgress, Grid, Link, Stack, Typography } from '@mui/joy'
import InnerLink from '../basic/innerLink/InnerLink'
import { modelKinds } from '../basic/chips'
import { useState } from 'react'
import InnerLinkButton from '../basic/innerLink/InnerLinkButton'
import { Model } from '@/types/entity/model'

export interface ModelsProps {
  isPublic: boolean
  onSelect?: (model: Model) => void
}
export default function Models({ isPublic, onSelect }: ModelsProps) {
  const [search, setSearch] = useState('')
  const { models, fetchingModels } = useModels(isPublic, search)

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <SearchInput
          placeholder="搜索算法"
          sx={{ flexGrow: 1 }}
          value={search}
          onChange={setSearch}
        />
        <InnerLinkButton
          variant="solid"
          to="/model/new"
          target={onSelect ? '_blank' : undefined}
          startDecorator={<AddIcon />}
        >
          创建算法
        </InnerLinkButton>
      </Stack>
      {fetchingModels && <CircularProgress sx={{ mx: 'auto', mt: 2, display: 'block' }} />}
      <Grid container spacing={2} py={2}>
        {models?.map((model) => (
          <Grid sm={12} md={onSelect ? 12 : 6} key={model.id}>
            <Card variant="outlined">
              <div>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography level="h5">
                    {onSelect ? (
                      <Link overlay underline="none" onClick={() => onSelect(model)} href="#">
                        {model.title}
                      </Link>
                    ) : (
                      <InnerLink overlay to={`/model/${model.id}`} underline="none">
                        {model.title}
                      </InnerLink>
                    )}
                  </Typography>
                  {modelKinds[model.kind]}
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
