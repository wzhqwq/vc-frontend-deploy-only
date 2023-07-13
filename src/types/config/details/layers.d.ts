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

export type OutputBaseParameters = {
  label_from: string
  is_main_out: boolean
  loss_weight: number
}
export type MSELossParameters = {
  size_average: boolean
  reduce: boolean
  reduction: 'mean' | 'sum' | 'none'
} & OutputBaseParameters

export type ReLUParameters = {
  inplace: boolean
}

export type SplitParameters = {
  split_size_or_sections: [number, number]
  dim: number
}

export type CrossEntropyLossParameters = {
  size_average: boolean
  reduce: boolean
  reduction: 'mean' | 'sum' | 'none'
  ignore_index: number
  label_smoothing: number
} & OutputBaseParameters
