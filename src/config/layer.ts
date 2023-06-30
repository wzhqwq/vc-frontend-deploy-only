import { joyTheme } from '@/theme'
import { DynamicShape, LayerConfig, VirtualValue } from '@/types/config/deepLearning'
import { Base1DKernelParameters, Conv2DParameters, LayerParameters } from '@/types/config/parameter'
import { Box, Rect } from '@svgdotjs/svg.js'

const toVirtualValue = (value: number, virtual = false) => {
  return { value, virtual, available: true }
}

const generateInputShapeFn = (index: number) => (inputShapes: DynamicShape[]) => {
  return inputShapes[index].shapeValue
}
const getKernelOutSize = (
  inSize: VirtualValue,
  kernelSize: number,
  stride: number,
  padding: number,
) => {
  return inSize.available
    ? {
        value: (inSize.value - kernelSize + 2 * padding) / stride + 1,
        virtual: inSize.virtual,
        available: true,
      }
    : {
        value: 0,
        virtual: false,
        available: false,
      }
}
const generate1DKernelOutputShapeFn =
  () => (inputShapes: DynamicShape[], parameters: Base1DKernelParameters) => {
    const [batchSize, , length] = inputShapes[0].shapeValue
    let newLength = getKernelOutSize(
      length,
      parameters.kernel_size,
      parameters.stride,
      parameters.padding,
    )
    return [batchSize, toVirtualValue(parameters.out_channels), newLength]
  }
const generate2DKernelOutputShapeFn =
  () => (inputShapes: DynamicShape[], parameters: Conv2DParameters) => {
    const [batchSize, , inHeight, inWidth] = inputShapes[0].shapeValue
    let newHeight = getKernelOutSize(
      inHeight,
      parameters.kernel_size[0],
      parameters.stride[0],
      parameters.padding[0],
    )
    let newWidth = getKernelOutSize(
      inWidth,
      parameters.kernel_size[1],
      parameters.stride[1],
      parameters.padding[1],
    )
    return [batchSize, toVirtualValue(parameters.out_channels), newHeight, newWidth]
  }

const renderSimpleRect = (box: Box) => {
  return new Rect()
    .size(box.w, box.h)
    .move(box.x, box.y)
    .radius(10)
    .fill(joyTheme.vars.palette.primary[700])
}

export const exampleLayer: LayerConfig<Conv2DParameters> = {
  name: 'Conv2D',
  renderer: renderSimpleRect,
  color: 'dark',
  inputs: [
    {
      type: 'input',
      side: 'top',
      shape: {
        placeholders: ['batch', 'channel', 'height', 'width'],
        shortNames: ['b', 'ch', 'h', 'w'],
        getShape: generateInputShapeFn(0),
      },
    },
  ],
  outputs: [
    {
      type: 'output',
      side: 'bottom',
      shape: {
        placeholders: ['batch', 'channel', 'height', 'width'],
        shortNames: ['b', 'ch', 'h', 'w'],
        getShape: generate2DKernelOutputShapeFn(),
      },
    },
  ],
  defaultParameters: {
    in_channels: 3,
    out_channels: 32,
    kernel_size: [3, 3],
    stride: [1, 1],
    padding: [0, 0],
    dilation: [1, 1],
    groups: 1,
    bias: true,
    padding_mode: 'zeros',
  },
  shapeChecker: (inputShapes: DynamicShape[], parameters: Conv2DParameters) => {
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
}
