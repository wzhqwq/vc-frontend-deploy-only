import { DynamicShape, VirtualValue } from './deepLearning'

export type ConfigParameterType = 'int' | 'float' | 'str' | 'bool' | 'tuple2'
export type ConfigParameterValue<T extends 'int' | 'str' | 'bool' | 'tuple2'> = T extends
  | 'int'
  | 'float'
  ? number
  : T extends 'str'
  ? string
  : T extends 'bool'
  ? boolean
  : T extends 'tuple2'
  ? [number, number]
  : never
export type FlatConfigParameters = Record<string, ConfigParameterValue<ConfigParameterType>>

export interface ConfigParameter<T extends ConfigParameterType, K extends string = string> {
  key: K
  type: T
  description: string
  inShape?: boolean
  default: ConfigParameterValue<T> | ((parameters: FlatConfigParameters) => ConfigParameterValue<T>)
  selections?: string[]
  validator?: (value: ConfigParameterValue<T>) => boolean
}
export type EachTypeOfConfigParameter<K extends string = string> =
  | ConfigParameter<'int', K>
  | ConfigParameter<'float', K>
  | ConfigParameter<'str', K>
  | ConfigParameter<'bool', K>
  | ConfigParameter<'tuple2', K>

export type AnyDimPlaceholders = `d${number}`
export type AllShapePlaceholders =
  | AnyDimPlaceholders
  | 'batch_size'
  | 'channels'
  | 'height'
  | 'width'
  | 'length'
  | 'dim'
  | 'features'
  | 'num_classes'
  | 'seq_length'
  | 'embed_dim'

type ShapeGetter<P extends FlatConfigParameters> = (
  inputs: DynamicShape[],
  parameters: P,
) => VirtualValue[] | undefined
export interface FixedDimensionShapeParameter<P extends FlatConfigParameters> {
  anyDimension?: false
  placeholders: AllShapePlaceholders[]
  getShape: ShapeGetter<P>
}
export interface AnyDimensionShapeParameter<P extends FlatConfigParameters> {
  anyDimension: true
  getShape: ShapeGetter<P>
}
export type ShapeParameter<P extends FlatConfigParameters> =
  | FixedDimensionShapeParameter<P>
  | AnyDimensionShapeParameter<P>

export type BaseChannelParameters = {
  in_channels: number
  out_channels: number
}
export type Base1DKernelParameters = BaseChannelParameters & {
  kernel_size: number
  stride: number
  padding: number
  dilation: number
}
export type Base2DKernelParameters = BaseChannelParameters & {
  kernel_size: [number, number]
  stride: [number, number]
  padding: [number, number]
  dilation: [number, number]
}
export type ConvCommonParameters = {
  groups: number
  bias: boolean
  padding_mode: 'zeros' | 'reflect' | 'replicate' | 'circular'
}
export type Conv1DParameters = Base1DKernelParameters & ConvCommonParameters
export type Conv2DParameters = Base2DKernelParameters & ConvCommonParameters

export type MaxPoolCommonParameters = {
  padding_mode: 'zeros' | 'reflect' | 'replicate' | 'circular'
  return_indices: boolean
  ceil_mode: boolean
}
export type MaxPool1DParameters = Base1DKernelParameters & MaxPoolCommonParameters
export type MaxPool2DParameters = Base2DKernelParameters & MaxPoolCommonParameters

export type AvgPoolCommonParameters = {
  ceil_mode: boolean
  count_include_pad: boolean
}
export type AvgPool1DParameters = Base1DKernelParameters & AvgPoolCommonParameters
export type AvgPool2DParameters = Base2DKernelParameters &
  AvgPoolCommonParameters & {
    divisor_override: number
  }

export type BatchNormParameters = {
  num_features: number
  eps: number
  momentum: number
  affine: boolean
  track_running_stats: boolean
}

export type LinearParameters = {
  in_features: number
  out_features: number
  bias: boolean
}
export type DropoutParameters = {
  p: number
  inplace: boolean
}

export type MSELossParameters = {
  size_average: boolean
  reduce: boolean
  reduction: 'mean' | 'sum' | 'none'
}
