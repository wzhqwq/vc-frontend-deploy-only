import { ConnectorConfig, DynamicShape, VirtualValue } from '@/types/config/deepLearning'
import { AllShapePlaceholders, ConfigParameterRecord, ShapeGetter } from '@/types/config/parameter'
import {
  Base1DKernelParameters,
  Base2DKernelParameters,
  CatParameters,
  FlattenParameters,
  LinearParameters,
  SplitParameters,
  StackParameters,
} from '@/types/config/details/layers'

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
  m: 'm',
  n: 'n',
  k: 'k',
}

export const generateInputShapeFn = (index: number) =>
  function (inputShapes: DynamicShape[]) {
    const shape = inputShapes[index]
    return shape.connected ? shape.shapeValue : undefined
  }
export function topInput<P extends ConfigParameterRecord>(
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

export function bottomOutput<P extends ConfigParameterRecord>(
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

export function getLinearOutputShapeFn(inputShapes: DynamicShape[], parameters: LinearParameters) {
  if (!inputShapes[0].connected) return [UNAVAILABLE, toVirtualValue(parameters.out_features)]

  const [dim] = inputShapes[0].shapeValue
  return [dim, toVirtualValue(parameters.out_features)]
}

export const generateSplitOutputShapeFn = (index: number) =>
  function (inputShapes: DynamicShape[], parameters: SplitParameters) {
    if (!inputShapes[0].connected) return undefined
    const shape = inputShapes[0].shapeValue
    const splitted = parameters.split_size_or_sections[index]
    return shape.map((value, i) => {
      if (i === parameters.dim) return toVirtualValue(splitted)
      return value
    })
  }

export const generateInputLayerOutputShapeFn = (dim: number) =>
  function () {
    return new Array(dim)
      .fill(0)
      .map(() => toVirtualValue(Math.floor(Math.random() * 100 + 1), true))
  }

export function getFlattenOutputShapeFn(
  inputShapes: DynamicShape[],
  parameters: FlattenParameters,
) {
  if (!inputShapes[0].connected) return undefined

  const dimensions = inputShapes[0].shapeValue
  const { start_dim, end_dim } = parameters
  const notFlattenedPrefix = dimensions.slice(0, start_dim)
  const notFlattenedSuffix = dimensions.slice(end_dim + 1)
  const dimsToFlatten = dimensions.slice(start_dim, end_dim + 1)
  if (dimsToFlatten.some((dim) => !dim.available))
    return [...notFlattenedPrefix, UNAVAILABLE, ...notFlattenedSuffix]
  const virtual = dimsToFlatten.some((dim) => dim.virtual)
  const flattened = toVirtualValue(
    dimsToFlatten.reduce((a, b) => a * b.value, 1),
    virtual,
  )
  return [...notFlattenedPrefix, flattened, ...notFlattenedSuffix]
}

export function getCatOutputShapeFn(inputShapes: DynamicShape[], parameters: CatParameters) {
  if (!inputShapes[0].connected || !inputShapes[1].connected) return undefined

  const { dim } = parameters
  const shape1 = inputShapes[0].shapeValue
  const shape2 = inputShapes[1].shapeValue
  const notConcatenatedPrefix = shape1.slice(0, dim)
  const notConcatenatedSuffix = shape1.slice(dim + 1)
  if (!shape1[dim].available || !shape2[dim].available)
    return [...notConcatenatedPrefix, UNAVAILABLE, ...notConcatenatedSuffix]
  const concatenated = toVirtualValue(
    shape1[dim].value + shape2[dim].value,
    shape1[dim].virtual || shape2[dim].virtual,
  )
  return [...notConcatenatedPrefix, concatenated, ...notConcatenatedSuffix]
}

export function getStackOutputShapeFn(
  inputShapes: DynamicShape[],
  parameters: StackParameters,
) {
  if (!inputShapes[0].connected || !inputShapes[1].connected) return undefined

  const { dim } = parameters
  const shape1 = inputShapes[0].shapeValue
  return [...shape1.slice(0, dim), toVirtualValue(2), ...shape1.slice(dim)]
}
