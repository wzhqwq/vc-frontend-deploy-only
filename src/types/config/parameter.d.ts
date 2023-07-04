import { DynamicShape, VirtualValue } from './deepLearning'

export type LayerParameterType = 'int' | 'tuple' | 'str' | 'bool' | 'tuple2'
export type LayerParameterValue<T extends LayerParameterType> = T extends 'int'
  ? number
  : T extends 'tuple'
  ? number[]
  : T extends 'str'
  ? string
  : T extends 'bool'
  ? boolean
  : T extends 'tuple2'
  ? [number, number]
  : never
export type LayerParameters = Record<string, LayerParameterValue>

export interface LayerParameter<K extends string = string> {
  key: K
  type: LayerParameterType
  description: string
  inShape: boolean
  default: LayerParameterValue<LayerParameterType>
  selections?: LayerParameterValue<LayerParameterType>[]
}

export type AnyDimPlaceholders = `d${number}`
export type AllShapePlaceholders =
  | AnyDimPlaceholders
  | 'batch_size'
  | 'channel'
  | 'height'
  | 'width'
  | 'length'
  | 'dim'
  | 'features'
  | 'num_classes'
  | 'seq_length'
  | 'embed_dim'

type ShapeGetter<P extends LayerParameters> = (
  inputs: DynamicShape[],
  parameters: P,
) => VirtualValue[] | undefined
export interface FixedDimensionShapeParameter<P extends LayerParameters> {
  anyDimension?: false
  placeholders: AllShapePlaceholders[]
  getShape: ShapeGetter<P>
}
export interface AnyDimensionShapeParameter<P extends LayerParameters> {
  anyDimension: true
  getShape: ShapeGetter<P>
}
export type ShapeParameter<P extends LayerParameters> =
  | FixedDimensionShapeParameter<P>
  | AnyDimensionShapeParameter<P>

export type Base1DKernelParameters = {
  in_channels: number
  out_channels: number
  kernel_size: number
  stride: number
  padding: number
  dilation: number
}
export type Base2DKernelParameters = {
  in_channels: number
  out_channels: number
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
