import { ProjectGraphEditor } from '@/component/visualization/svgEditors'
import { Box, Button, Divider, FormLabel, Stack, Switch, Typography } from '@mui/joy'
import { Skeleton } from '@mui/material'
import { useParams } from 'react-router-dom'
import { ProjectName, UserWidget } from '@/component/basic/getters'
import { useTaskGroup } from '@/api/task'
import { useUser } from '@/api/user'
import { TASK_FINISHED } from '@/utils/constants'
import { useEffect, useState } from 'react'
import InnerLink from '@/component/basic/innerLink/InnerLink'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DangerousIcon from '@mui/icons-material/Dangerous'
import { RefreshContext } from '@/component/context/RefreshContext'
import { formatTime } from '@/utils/time'
import { taskStatus } from '@/component/basic/chips'

export default function ViewTask() {
  const { id: groupId } = useParams<{ id: string }>()
  const [autoUpdate, setAutoUpdate] = useState(true)
  const { group, fetchingGroup, terminateGroup, terminatingGroup } = useTaskGroup(
    Number(groupId),
    autoUpdate,
  )
  const { user } = useUser()
  const isOwner = !!user && user.id === group?.user_id

  useEffect(() => {
    if ((group?.status ?? 0) >= TASK_FINISHED) {
      setTimeout(() => setAutoUpdate(false), 2000)
    }
  }, [group?.status])

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        {group ? (
          <>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography component="div" level="h6">
                <UserWidget userId={group.user_id} />
              </Typography>
              <Divider orientation="vertical" />
              <Box>
                <Typography level='body2'>所在项目</Typography>
                <InnerLink to={`/project/${group.project_id}`}>
                  <ProjectName projectId={group.project_id} />
                </InnerLink>
              </Box>
              <Divider orientation="vertical" />
              <Box>
                <Typography level='body2'>创建时间</Typography>
                <Typography level='body1'>{formatTime(group.created_at)}</Typography>
              </Box>
              <Divider orientation="vertical" />
              <Box>
                <Typography level='body2'>任务状态</Typography>
                {taskStatus[group.status]}
              </Box>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <FormLabel>自动更新</FormLabel>
            <Switch checked={autoUpdate} onChange={(e) => setAutoUpdate(e.target.checked)} />
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
      {group ? (
        <RefreshContext.Provider value={autoUpdate}>
          <ProjectGraphEditor
            projectId={group.project_id}
            groupId={Number(groupId)}
            readonly={!isOwner || group.status < TASK_FINISHED}
            canRun={isOwner && group.status >= TASK_FINISHED}
          />
        </RefreshContext.Provider>
      ) : (
        fetchingGroup && <Skeleton variant="rounded" width="100%" height={300} />
      )}
    </Box>
  )
}
