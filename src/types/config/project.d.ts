import { EachPreprocessParameter } from './details/tasks'

export interface ProjectGraph {
  preProcesses: PreprocessTaskData[]
  algorithms: TaskData<any>[]
  analyses: TaskData<any>[]
}

export interface TaskData<T extends Record<string, any>> {
  id: string
  task_type: string
  parameters: T
  inPeers: string[]
  taskId?: number
}

export type PreprocessTaskData = TaskData<EachPreprocessParameter>
