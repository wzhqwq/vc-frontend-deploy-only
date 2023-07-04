import { DynamicShapeConnected, LayerConfig } from '@/types/config/deepLearning'
import {
  Base1DKernelParameters,
  Base2DKernelParameters,
  Conv2DParameters,
  ConvCommonParameters,
  LayerParameter,
} from '@/types/config/parameter'
import { bottomOutput, get2DKernelOutputShapeFn, topInput } from './connectorHelper'
import { createLayerConfig, rectRenderer1 } from './layerHelper'

const base1DKernelParameters: LayerParameter<keyof Base1DKernelParameters>[] = [
  { key: 'in_channels', type: 'int', description: '输入通道数', inShape: true, default: 1 },
  { key: 'out_channels', type: 'int', description: '输出通道数', inShape: false, default: 1 },
  { key: 'kernel_size', type: 'int', description: '卷积核大小', inShape: false, default: 1 },
  { key: 'stride', type: 'int', description: '步幅', inShape: false, default: 1 },
  { key: 'padding', type: 'int', description: '填充大小', inShape: false, default: 0 },
  { key: 'dilation', type: 'int', description: '扩张率', inShape: false, default: 1 },
]
const base2DKernelParameters: LayerParameter<keyof Base2DKernelParameters>[] = [
  { key: 'in_channels', type: 'int', description: '输入通道数', inShape: true, default: 1 },
  { key: 'out_channels', type: 'int', description: '输出通道数', inShape: false, default: 1 },
  {
    key: 'kernel_size',
    type: 'tuple2',
    description: '卷积核大小',
    inShape: false,
    default: [1, 1],
  },
  { key: 'stride', type: 'tuple2', description: '步幅', inShape: false, default: [1, 1] },
  { key: 'padding', type: 'tuple2', description: '填充大小', inShape: false, default: [0, 0] },
  { key: 'dilation', type: 'tuple2', description: '扩张率', inShape: false, default: [1, 1] },
]
const convCommonParameters: LayerParameter<keyof ConvCommonParameters>[] = [
  { key: 'groups', type: 'int', description: '分组数', inShape: false, default: 1 },
  { key: 'bias', type: 'bool', description: '是否使用偏置', inShape: false, default: true },
  {
    key: 'padding_mode',
    type: 'str',
    description: '填充模式',
    inShape: false,
    default: 'zeros',
    selections: ['zeros', 'reflect', 'replicate', 'circular'],
  },
]

const conv2d = createLayerConfig<Conv2DParameters>({
  name: 'Conv2D',
  renderer: rectRenderer1,
  inputs: [topInput(0, ['batch_size', 'channel', 'height', 'width'])],
  outputs: [
    bottomOutput(get2DKernelOutputShapeFn, ['batch_size', 'out_channel', 'height', 'width']),
  ],
  parameters: [...base2DKernelParameters, ...convCommonParameters],
  shapeChecker: (inputShapes: DynamicShapeConnected[], parameters: Conv2DParameters) => {
    const [, inChannel, inHeight, inWidth] = inputShapes[0].shapeValue
    if (!inChannel.available) {
      return `输入形状中的通道数不可用`
    }
    if (inChannel.value != parameters.in_channels) {
      return `输入形状中的通道数 ${inChannel.value} 与参数中通道数 ${parameters.in_channels} 不匹配`
    }
    if (
      inWidth.available &&
      inWidth.value - parameters.kernel_size[0] + 2 * parameters.padding[0] < 0
    ) {
      return `输入形状中的宽度过小，无法进行卷积运算`
    }
    if (
      inHeight.available &&
      inHeight.value - parameters.kernel_size[1] + 2 * parameters.padding[1] < 0
    ) {
      return `输入形状中的高度过小，无法进行卷积运算`
    }
    return null
  },
})

/*
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
*/

export const layers = [
  conv2d,
]
