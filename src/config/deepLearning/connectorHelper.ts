import { ConnectorConfig, DynamicShape, VirtualValue } from '@/types/config/deepLearning'
import {
  AllShapePlaceholders,
  Base1DKernelParameters,
  Base2DKernelParameters,
  Conv1DParameters,
  Conv2DParameters,
  LayerParameters,
  ShapeGetter,
} from '@/types/config/parameter'

export const placeholderToShortName: Record<AllShapePlaceholders, string> = {
  batch_size: 'b',
  channels: 'ch',
  height: 'h',
  width: 'w',
  length: 'l',
  dim: 'n',
  features: 'ft',
  num_classes: 'cls',
  seq_length: 'seq',
  embed_dim: 'em',
}

export const generateInputShapeFn = (index: number) =>
  function (inputShapes: DynamicShape[]) {
    const shape = inputShapes[index]
    return shape.connected ? shape.shapeValue : undefined
  }
export function topInput<P extends LayerParameters>(
  index: number,
  placeholders?: AllShapePlaceholders[],
) {
  return {
    type: 'input',
    side: 'top',
    shape: placeholders
      ? {
          anyDimension: false,
          placeholders,
          getShape: generateInputShapeFn(index),
        }
      : {
          anyDimension: true,
          getShape: generateInputShapeFn(index),
        },
  } as ConnectorConfig<P>
}

export function bottomOutput<P extends LayerParameters>(
  getShape: ShapeGetter<P>,
  placeholders?: AllShapePlaceholders[],
) {
  return {
    type: 'output',
    side: 'bottom',
    shape: placeholders
      ? {
          anyDimension: false,
          placeholders,
          getShape,
        }
      : {
          anyDimension: true,
          getShape,
        },
  } as ConnectorConfig<P>
}

const toVirtualValue = (value: number, virtual = false) => {
  return { value, virtual, available: true }
}
const UNAVAILABLE = { value: 0, virtual: false, available: false }

export function getKernelOutSize(
  inSize: VirtualValue,
  kernelSize: number,
  stride: number,
  padding: number,
) {
  return inSize.available
    ? {
        value: (inSize.value - kernelSize + 2 * padding) / stride + 1,
        virtual: inSize.virtual,
        available: true,
      }
    : UNAVAILABLE
}
export function getKernelOutputShapeFn(
  inputShapes: DynamicShape[],
  parameters: Base1DKernelParameters,
) {
  if (!inputShapes[0].connected)
    return [UNAVAILABLE, toVirtualValue(parameters.out_channels), UNAVAILABLE]

  const [batchSize, , length] = inputShapes[0].shapeValue
  let newLength = getKernelOutSize(
    length,
    parameters.kernel_size,
    parameters.stride,
    parameters.padding,
  )
  return [batchSize, toVirtualValue(parameters.out_channels), newLength]
}
export function get1DKernelOutputShapeFn(
  inputShapes: DynamicShape[],
  parameters: Base1DKernelParameters,
) {
  if (!inputShapes[0].connected)
    return [UNAVAILABLE, toVirtualValue(parameters.out_channels), UNAVAILABLE]

  const [batchSize, , inLength] = inputShapes[0].shapeValue
  let newLength = getKernelOutSize(
    inLength,
    parameters.kernel_size,
    parameters.stride,
    parameters.padding,
  )
  return [batchSize, toVirtualValue(parameters.out_channels), newLength]
}
export function get2DKernelOutputShapeFn(
  inputShapes: DynamicShape[],
  parameters: Base2DKernelParameters,
) {
  if (!inputShapes[0].connected)
    return [UNAVAILABLE, toVirtualValue(parameters.out_channels), UNAVAILABLE, UNAVAILABLE]

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
