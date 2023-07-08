import { useProject } from "@/api/project"
import { LayerGraphEditor } from "@/component/visualization/lazySvgEditors"
import { useParams } from "react-router-dom"

export default function ViewProject() {
  const { id: projectId } = useParams<{ id: string }>()
  const { project, fetchingProject } = useProject(projectId == 'new' ? undefined : Number(projectId))

  return (
    <div>
      <LayerGraphEditor />
    </div>
  )
}