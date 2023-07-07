import { ProjectGraph } from "@/types/config/project"
import { useState } from "react"

interface ProjectGraphEditorProps {
  filename?: string
  onSave?: (filename: string) => void
}

export default function ProjectGraphEditor({ filename, onSave }: ProjectGraphEditorProps) {
  const [graph, setGraph] = useState<ProjectGraph>()
  
  return (
    <div></div>
  )
}