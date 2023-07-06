import {
  EachTypeOfConfigParameter,
  Base1DKernelParameters,
  Base2DKernelParameters,
  Conv2DParameters,
  ConvCommonParameters,
  Conv1DParameters,
  MaxPoolCommonParameters,
  MaxPool1DParameters,
  MaxPool2DParameters,
  AvgPoolCommonParameters,
  AvgPool1DParameters,
  AvgPool2DParameters,
  BatchNormParameters,
} from '@/types/config/parameter'
import {
  bottomOutput,
  generateInputShapeFn,
  get1DKernelOutputShapeFn,
  get2DKernelOutputShapeFn,
  topInput,
} from './connectorHelper'
import { createLayerConfig, rectRenderer1, rectRenderer2 } from './layerHelper'
import { check1DKernelSize, check2DKernelSize, checkInChannel, checkNumFeatures } from './validation'

const base1DKernelParameters: EachTypeOfConfigParameter<keyof Base1DKernelParameters>[] = [
  { key: 'in_channels', type: 'int', description: '输入通道数', default: 1 },
  { key: 'out_channels', type: 'int', description: '输出通道数', inShape: true, default: 1 },
  { key: 'kernel_size', type: 'int', description: '卷积核大小', inShape: true, default: 1 },
  { key: 'stride', type: 'int', description: '步幅', inShape: true, default: 1 },
  { key: 'padding', type: 'int', description: '填充大小', inShape: true, default: 0 },
  { key: 'dilation', type: 'int', description: '扩张率', default: 1 },
]
const base2DKernelParameters: EachTypeOfConfigParameter<keyof Base2DKernelParameters>[] = [
  { key: 'in_channels', type: 'int', description: '输入通道数', default: 1 },
  { key: 'out_channels', type: 'int', description: '输出通道数', inShape: true, default: 1 },
  {
    key: 'kernel_size',
    type: 'tuple2',
    description: '卷积核大小',
    inShape: true,
    default: [1, 1],
  },
  { key: 'stride', type: 'tuple2', description: '步幅', inShape: true, default: [1, 1] },
  { key: 'padding', type: 'tuple2', description: '填充大小', inShape: true, default: [0, 0] },
  { key: 'dilation', type: 'tuple2', description: '扩张率', default: [1, 1] },
]
const convCommonParameters: EachTypeOfConfigParameter<keyof ConvCommonParameters>[] = [
  {
    key: 'groups',
    type: 'int',
    description: '输入和输出之间的连接方式',
    default: 1,
  },
  { key: 'bias', type: 'bool', description: '是否添加偏置', default: true },
  {
    key: 'padding_mode',
    type: 'str',
    description: '填充模式',
    default: 'zeros',
    selections: ['zeros', 'reflect', 'replicate', 'circular'],
  },
]

const conv1d = createLayerConfig<Conv1DParameters>({
  name: 'Conv1D',
  renderer: rectRenderer1,
  inputs: [topInput(0, ['batch_size', 'channels', 'length'])],
  outputs: [bottomOutput(get1DKernelOutputShapeFn, ['batch_size', 'channels', 'length'])],
  parameters: [...base1DKernelParameters, ...convCommonParameters],
  checkers: [checkInChannel, check1DKernelSize],
})
const conv2d = createLayerConfig<Conv2DParameters>({
  name: 'Conv2D',
  renderer: rectRenderer1,
  inputs: [topInput(0, ['batch_size', 'channels', 'height', 'width'])],
  outputs: [bottomOutput(get2DKernelOutputShapeFn, ['batch_size', 'channels', 'height', 'width'])],
  parameters: [...base2DKernelParameters, ...convCommonParameters],
  checkers: [checkInChannel, check2DKernelSize],
})

const maxPoolCommonParameters: EachTypeOfConfigParameter<keyof MaxPoolCommonParameters>[] = [
  {
    key: 'padding_mode',
    type: 'str',
    description: '填充模式',
    default: 'zeros',
    selections: ['zeros', 'reflect', 'replicate', 'circular'],
  },
  {
    key: 'return_indices',
    type: 'bool',
    description: '是否返回最大值的索引',
    default: false,
  },
  {
    key: 'ceil_mode',
    type: 'bool',
    description: '是否向上取整计算输出大小',
    default: false,
  },
]

const maxPool1d = createLayerConfig<MaxPool1DParameters>({
  name: 'MaxPool1D',
  renderer: rectRenderer2,
  inputs: [topInput(0, ['batch_size', 'channels', 'length'])],
  outputs: [bottomOutput(get1DKernelOutputShapeFn, ['batch_size', 'channels', 'length'])],
  parameters: [...base1DKernelParameters, ...maxPoolCommonParameters],
  checkers: [checkInChannel, check1DKernelSize],
})
const maxPool2d = createLayerConfig<MaxPool2DParameters>({
  name: 'MaxPool2D',
  renderer: rectRenderer2,
  inputs: [topInput(0, ['batch_size', 'channels', 'height', 'width'])],
  outputs: [bottomOutput(get2DKernelOutputShapeFn, ['batch_size', 'channels', 'height', 'width'])],
  parameters: [...base2DKernelParameters, ...maxPoolCommonParameters],
  checkers: [checkInChannel, check2DKernelSize],
})

const avgPoolCommonParameters: EachTypeOfConfigParameter<keyof AvgPoolCommonParameters>[] = [
  {
    key: 'ceil_mode',
    type: 'bool',
    description: '是否向上取整计算输出大小',
    default: false,
  },
  {
    key: 'count_include_pad',
    type: 'bool',
    description: '是否包含填充区域的值在内进行平均计算',
    default: true,
  },
]

const avgPool1d = createLayerConfig<AvgPool1DParameters>({
  name: 'AvgPool1D',
  renderer: rectRenderer2,
  inputs: [topInput(0, ['batch_size', 'channels', 'length'])],
  outputs: [bottomOutput(get1DKernelOutputShapeFn, ['batch_size', 'channels', 'length'])],
  parameters: [...base1DKernelParameters, ...avgPoolCommonParameters],
  checkers: [checkInChannel, check1DKernelSize],
})
const avgPool2d = createLayerConfig<AvgPool2DParameters>({
  name: 'AvgPool2D',
  renderer: rectRenderer2,
  inputs: [topInput(0, ['batch_size', 'channels', 'height', 'width'])],
  outputs: [bottomOutput(get2DKernelOutputShapeFn, ['batch_size', 'channels', 'height', 'width'])],
  parameters: [
    ...base2DKernelParameters,
    ...avgPoolCommonParameters,
    {
      key: 'divisor_override',
      type: 'int',
      description: '指定除数的大小',
      default: 0,
    },
  ],
  checkers: [checkInChannel, check2DKernelSize],
})

const batchNormParameters: EachTypeOfConfigParameter<keyof BatchNormParameters>[] = [
  {
    key: 'num_features',
    type: 'int',
    description: '输入特征的通道数',
    default: 0,
  },
  {
    key: 'eps',
    type: 'float',
    description: '分母中的值，防止除数为0',
    default: 1e-5,
  },
  {
    key: 'momentum',
    type: 'float',
    description: '用于计算移动平均的动量',
    default: 0.1,
  },
  {
    key: 'affine',
    type: 'bool',
    description: '是否学习可学习的线性变换参数',
    default: true,
  },
  {
    key: 'track_running_stats',
    type: 'bool',
    description: '是否在训练过程中跟踪训练集的统计信息',
    default: true,
  },
]
const batchNorm1d = createLayerConfig<BatchNormParameters>({
  name: 'BatchNorm1D',
  renderer: rectRenderer1,
  inputs: [topInput(0, ['batch_size', 'channels', 'length'])],
  outputs: [bottomOutput(generateInputShapeFn(0), ['batch_size', 'channels', 'length'])],
  parameters: batchNormParameters,
  checkers: [checkNumFeatures],
})
const batchNorm2d = createLayerConfig<BatchNormParameters>({
  name: 'BatchNorm2D',
  renderer: rectRenderer1,
  inputs: [topInput(0, ['batch_size', 'channels', 'height', 'width'])],
  outputs: [bottomOutput(generateInputShapeFn(0), ['batch_size', 'channels', 'height', 'width'])],
  parameters: batchNormParameters,
  checkers: [checkNumFeatures],
})

export const layers = [
  conv1d,
  conv2d,
  maxPool1d,
  maxPool2d,
  avgPool1d,
  avgPool2d,
  batchNorm1d,
]
