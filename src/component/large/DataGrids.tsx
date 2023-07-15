import { Button, styled } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Component, useMemo } from 'react'

import { TaskGroup } from '@/types/entity/task'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { taskStatus } from '../basic/chips'
import { formatTime } from '@/utils/time'
import { ProjectName, UserWidget } from '../basic/getters'
import { QueryTaskGroupsResult } from '@/api/task'

import PageviewRoundedIcon from '@mui/icons-material/PageviewRounded'

const StyledDataGrid = styled(DataGrid<any>)(({ theme }) => ({
  borderRadius: theme.vars.radius.md,
}))

export function TaskGroupDataGrid({ result }: { result: QueryTaskGroupsResult }) {
  const navigate = useNavigate()
  const taskGroupColumns: GridColDef<TaskGroup>[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: '项目名称',
        width: 200,
        renderCell: (params) => <ProjectName projectId={params.row.project_id} />,
      },
      {
        field: 'time',
        headerName: '创建时间',
        width: 160,
        valueGetter: (params) => formatTime(params.row.created_at),
      },
      {
        field: 'user',
        headerName: '所属用户',
        width: 200,
        renderCell: (params) => <UserWidget userId={params.row.user_id} />,
      },
      {
        field: 'status',
        headerName: '状态',
        width: 200,
        renderCell: (params) => taskStatus[params.row.status],
      },
      {
        field: 'action',
        headerName: '',
        width: 200,
        renderCell: (params) => (
          <>
            <Button
              variant="plain"
              startDecorator={<PageviewRoundedIcon />}
              onClick={() => navigate(`/task/${params.row.id}`)}
            >
              查看
            </Button>
          </>
        ),
      },
    ],
    [navigate],
  )
  return (
    <StyledDataGrid
      rows={result.taskGroups ?? []}
      columns={taskGroupColumns}
      loading={result.fetchingTaskGroups}
    />
  )
}
