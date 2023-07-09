import { ProjectGraph, TaskData } from '@/types/config/project'
import { Project } from '@/types/entity/project'
import { Box, Button, Divider, Stack, Typography } from '@mui/joy'
import { useMemo } from 'react'
import { useTaskGroup } from '@/api/task'
import { PreprocessTaskCard } from './TaskCard'
import { nanoid } from 'nanoid'
import { defaultImgPreprocessParameter } from '@/config/projectGraph/taskData'
import { Control, useFieldArray, useForm } from 'react-hook-form'

import AddIcon from '@mui/icons-material/Add'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'

interface ProjectGraphEditorProps {
  editing: boolean
  project: Pick<Project, 'config'> & Partial<Project>
  groupId?: number
}

export default function ProjectGraphEditor({ editing, project, groupId }: ProjectGraphEditorProps) {
  const { tasks } = useTaskGroup(groupId)

  const graph = useMemo(() => {
    const fillInTaskId = (taskData: TaskData<any>) => ({
      ...taskData,
      taskId: tasks?.find((t) => t.item_id == taskData.id)?.id,
    })
    return {
      preProcesses: project.config.preProcesses.map(fillInTaskId),
      algorithms: project.config.algorithms.map(fillInTaskId),
      analyses: project.config.analyses.map(fillInTaskId),
    } as ProjectGraph
  }, [project, tasks])
  const { control, reset } = useForm({ values: graph })

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="solid" startDecorator={<PlayArrowRoundedIcon />} color="primary">
          继续运行
        </Button>
        <Button variant="soft" startDecorator={<ReplayRoundedIcon />} color="primary">
          重新运行
        </Button>
      </Stack>
      {graph && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr auto 1fr',
            gap: 2,
            mt: 2,
          }}
        >
          <TaskSlot
            title="预处理"
            name='preProcesses'
            control={control}
            renderer={(task, index) => (
              <PreprocessTaskCard
                key={task.id}
                index={index}
                control={control}
                reset={reset}
                originalParameters={
                  project.config.preProcesses.find((t) => t.id == task.id)?.parameters
                }
              />
            )}
            initialParameters={defaultImgPreprocessParameter}
          />
          {/* <Divider orientation="vertical" />
          <TaskSlot
            title="算法"
            renderer={() => <div>结束</div>}
            initialParameters={{}}
          />
          <Divider orientation="vertical" />
          <TaskSlot
            title="分析"
            renderer={() => <div>结束</div>}
            initialParameters={{}}
          /> */}
        </Box>
      )}
    </Box>
  )
}

interface TaskSlotProps<T extends Record<string, any>> {
  title: string
  name: keyof ProjectGraph
  control: Control<ProjectGraph>
  renderer: (task: TaskData<T>, index: number) => JSX.Element
  initialParameters: T
}
function TaskSlot<T extends Record<string, any>>(props: TaskSlotProps<T>) {
  const { fields, append } = useFieldArray({
    control: props.control,
    name: props.name,
  })
  const handleAdd = () => {
    const id = nanoid()
    const taskData: TaskData<T> = {
      id,
      task_type: '',
      parameters: props.initialParameters,
      inPeers: [],
    }
    append(taskData)
  }
  return (
    <Stack alignItems="center" spacing={1}>
      <Typography level="h5" sx={{ mb: 2 }}>
        {props.title}
      </Typography>
      {fields.map(props.renderer)}
      <Button variant="soft" size="lg" startDecorator={<AddIcon />} fullWidth onClick={handleAdd}>
        添加
      </Button>
    </Stack>
  )
}
