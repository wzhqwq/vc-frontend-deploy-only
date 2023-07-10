import { ProjectGraphEditor } from '@/component/visualization/svgEditors'
import { Box, Button, Chip, Divider, FormLabel, Stack, Switch, Typography } from '@mui/joy'
import { Link, Skeleton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { ProjectName, UserWidget } from '@/component/basic/getters'
import { useTaskGroup } from '@/api/task'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DangerousIcon from '@mui/icons-material/Dangerous'
import { useUser } from '@/api/user'
import { TASK_FINISHED } from '@/utils/constants'
import { useState } from 'react'

export default function ViewTask() {
  const { id: groupId } = useParams<{ id: string }>()
  const [autoUpdate, setAutoUpdate] = useState(false)
  const { group, fetchingGroup, tasks, terminateGroup, terminatingGroup } = useTaskGroup(
    Number(groupId),
    autoUpdate,
  )
  const { user } = useUser()
  const isOwner = !!user && user.id === group?.user_id

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {group ? (
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
            <FormLabel>自动更新</FormLabel>
            <Switch
              checked={autoUpdate}
              onChange={(e) => setAutoUpdate(e.target.checked)}
            />
            {isOwner && group.status < TASK_FINISHED && (
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
            )}
          </>
        ) : (
          fetchingGroup && <Skeleton variant="text" sx={{ fontSize: '2rem', width: 100 }} />
        )}
      </Stack>
      <Divider sx={{ mt: 2 }} />
      {group ? (
        <ProjectGraphEditor
          projectId={group.project_id}
          groupId={Number(groupId)}
          readonly={!isOwner || group.status < TASK_FINISHED}
        />
      ) : (
        fetchingGroup && <Skeleton variant="rounded" width="100%" height={300} />
      )}
    </Box>
  )
}
