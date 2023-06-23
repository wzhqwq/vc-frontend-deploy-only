import { ShapeCalculatingEnv, VirtualValue } from "./deepLearning"

export type ParameterType = 'int' | 'tuple' | 'str' | 'bool'

export interface ConfigParameter {
  key: string
  type: [ParameterType] | [ParameterType, ParameterType]
  default: string
  description: string
  inShape: boolean
}

export interface ShapeParameter {
  placeholders: string[]
  shortNames: string[]
  getShape: (env: ShapeCalculatingEnv) => VirtualValue[]
}