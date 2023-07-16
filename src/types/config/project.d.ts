import { Dataset } from '../entity/dataset'
import {
  DatasetParameter,
  EachAlgorithmParameter,
  EachAnalysisParameter,
  EachPreprocessParameter,
} from './details/tasks'

export interface ProjectGraph {
  preProcesses: PreprocessTaskData[]
  algorithms: AlgorithmTaskData[]
  analyses: AnalysisTaskData[]
  datasets: DatasetTaskData[]
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
export type DatasetTaskData = TaskData<DatasetParameter>

export type EachTaskParameter =
  | EachPreprocessParameter
  | EachAlgorithmParameter
  | EachAnalysisParameter
  | DatasetParameter
export type EachTaskData =
  | PreprocessTaskData
  | AlgorithmTaskData
  | AnalysisTaskData
  | DatasetTaskData

export interface BasicResult {
  extension: string
  filename: string
}
