import {
  EachAlgorithmParameter,
  EachAnalysisParameter,
  EachPreprocessParameter,
} from './details/tasks'

export interface ProjectGraph {
  preProcesses: PreprocessTaskData[]
  algorithms: AlgorithmTaskData[]
  analyses: AnalysisTaskData[]
}

export interface TaskData<T extends Record<string, any>> {
  id: string
  task_type: string
  parameters: T
  inPeers: string[]
  taskId?: number
}

export type PreprocessTaskData = TaskData<EachPreprocessParameter>
export type AlgorithmTaskData = TaskData<EachAlgorithmParameter>
export type AnalysisTaskData = TaskData<EachAnalysisParameter>

export type EachTaskParameter =
  | EachPreprocessParameter
  | EachAlgorithmParameter
  | EachAnalysisParameter
export type EachTaskData = PreprocessTaskData | AlgorithmTaskData | AnalysisTaskData

export interface BasicResult {
  extension: string
  filename: string
}
