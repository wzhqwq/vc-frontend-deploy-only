import { Box } from '@mui/joy'

import { useTaskGroups } from '@/api/task'
import { TaskGroupDataGrid } from '@/component/visualization/lazyDataGrids'

export default function OwnTasks() {
  return (
    <Box sx={{ boxSizing: 'border-box', height: '100%', py: 2 }}>
      <TaskGroupDataGrid result={useTaskGroups(false)} />
    </Box>
  )
}
