import { Box } from '@mui/joy'

import { useTaskGroups } from '@/api/task'
import { TaskGroupDataGrid } from '@/component/large/lazyDataGrids'

export default function PublicTasks() {
  return (
    <Box sx={{ boxSizing: 'border-box', height: '100%', py: 2 }}>
      <TaskGroupDataGrid result={useTaskGroups(true)} />
    </Box>
  )
}
