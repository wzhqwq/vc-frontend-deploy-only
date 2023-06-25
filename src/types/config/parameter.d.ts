import { DynamicShape, VirtualValue } from "./deepLearning"

export type LayerParameterType = 'int' | 'tuple' | 'str' | 'bool'
export type LayerParameterValue = string | number | boolean | [number] | [number, number]
export type LayerParameters = Record<string, LayerParameterValue>

export interface LayerParameter {
  key: string
  type: [LayerParameterType] | [LayerParameterType, LayerParameterType]
  default: LayerParameterValue
  description: string
  inShape: boolean
}

export interface ShapeParameter<P extends LayerParameters> {
  placeholders: string[]
  shortNames: string[]
  getShape: (inputs: DynamicShape[], parameters: P) => VirtualValue[]
}

export type Base1DKernelParameters = {
  in_channels: number
  out_channels: number
  kernel_size: number
  stride: number
  padding: number
  dilation: number
}
export type Base2DKernelParameters =  {
  in_channels: number
  out_channels: number
  kernel_size: [number, number]
  stride: [number, number]
  padding: [number, number]
  dilation: [number, number]
}
export type Conv1DParameters = Base1DKernelParameters & {
  groups: number
  bias: boolean
  padding_mode: 'zeros' | 'reflect' | 'replicate' | 'circular'
}
export type Conv2DParameters = Base2DKernelParameters & {
  groups: number
  bias: boolean
  padding_mode: 'zeros' | 'reflect' | 'replicate' | 'circular'
}
export type MaxPool1DParameters = Base1DKernelParameters & {
  padding_mode: 'zeros' | 'reflect' | 'replicate' | 'circular'
  return_indices: boolean
  ceil_mode: boolean
}
export type MaxPool2DParameters = Base2DKernelParameters & {
  padding_mode: 'zeros' | 'reflect' | 'replicate' | 'circular'
  return_indices: boolean
  ceil_mode: boolean
}
export type AvgPool1DParameters = Base1DKernelParameters & {
  ceil_mode: boolean
  count_include_pad: boolean
  divisor_override: number
}
export type AvgPool2DParameters = Base2DKernelParameters & {
  ceil_mode: boolean
  count_include_pad: boolean
  divisor_override: number
}

export type BatchNormXDParameters = {
  num_features: number
  eps: number
  momentum: number
  affine: boolean
  track_running_stats: boolean
}

