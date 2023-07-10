import { ProjectGraphEditor } from '@/component/visualization/svgEditors'
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/joy'
import { Link, Skeleton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { ProjectName, UserWidget } from '@/component/basic/getters'
import { useTaskGroup } from '@/api/task'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DangerousIcon from '@mui/icons-material/Dangerous';

export default function ViewTask() {
  const { id: groupId } = useParams<{ id: string }>()
  const { group, fetchingGroup, tasks, terminateGroup, terminatingGroup } = useTaskGroup(Number(groupId))

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {fetchingGroup && <Skeleton variant="text" sx={{ fontSize: '2rem', width: 100 }} />}
        {group && (
          <>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography component="div" level="h6">
                <UserWidget />
              </Typography>
              <ChevronRightIcon color="secondary" />
              <Typography component="div" level="h4">
                <Link href={`/project/${group.project_id}`}>
                  <ProjectName projectId={group.project_id} />
                </Link>
              </Typography>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="danger"
              variant="soft"
              startDecorator={<DangerousIcon />}
              onClick={terminateGroup}
              disabled={terminatingGroup}
              loading={terminatingGroup}
            >
              中止任务
            </Button>
          </>
        )}
      </Stack>
      <Divider sx={{ mt: 2 }} />
      {fetchingGroup && <Skeleton variant="rounded" width="100%" height={300} />}
      {group && <ProjectGraphEditor projectId={group.project_id} groupId={Number(groupId)} readonly />}
    </Box>
  )
}
