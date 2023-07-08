import { useProject } from "@/api/project"
import { useParams } from "react-router-dom"

export default function ViewProject() {
  const { id: projectId } = useParams<{ id: string }>()
  const { project, fetchingProject } = useProject(projectId == 'new' ? undefined : Number(projectId))

  return (
    <div></div>
  )
}