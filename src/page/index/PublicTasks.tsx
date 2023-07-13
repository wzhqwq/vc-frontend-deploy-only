import { Box } from '@mui/joy'

import { useTaskGroups } from '@/api/task'
import { TaskGroupDataGrid } from '@/component/visualization/lazyDataGrids'

export default function PublicTasks() {
  return (
    <Box my={2}>
      <TaskGroupDataGrid result={useTaskGroups(true)} />
    </Box>
  )
}
