import { useProject } from '@/api/project'
import { LayerGraphEditor } from '@/component/visualization/lazySvgEditors'
import { ProjectGraphEditor } from '@/component/visualization/svgEditors'
import { Box, CircularProgress } from '@mui/joy'
import { useParams } from 'react-router-dom'

export default function ViewProject() {
  const { id: projectId } = useParams<{ id: string }>()
  const { project, fetchingProject } = useProject(
    projectId == 'new' ? undefined : Number(projectId),
  )

  return (
    <Box mt={4}>
      {/* <LayerGraphEditor /> */}
      {fetchingProject && <CircularProgress sx={{ mx: 'auto', display: 'block' }} />}
      {project && <ProjectGraphEditor project={project} editing={false} />}
    </Box>
  )
}
