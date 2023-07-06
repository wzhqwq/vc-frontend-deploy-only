import { DynamicShapeConnected, LayerChecker } from '@/types/config/deepLearning'
import { Base1DKernelParameters, Base2DKernelParameters, BaseChannelParameters } from '@/types/config/parameter'

export const checkInChannel: LayerChecker<{ in_channels: number }> = (
  inputShapes: DynamicShapeConnected[],
  parameters: { in_channels: number },
) => {
  const [, inChannel] = inputShapes[0].shapeValue
  if (!inChannel.available) {
    return `输入形状中的通道数未知`
  }
  if (inChannel.value != parameters.in_channels) {
    return `输入形状中的通道数 ${inChannel.value} 与参数中通道数 ${parameters.in_channels} 不匹配`
  }
  return null
}
export const checkNumFeatures: LayerChecker<{ num_features: number }> = (
  inputShapes: DynamicShapeConnected[],
  parameters: { num_features: number },
) => {
  const [, inChannel] = inputShapes[0].shapeValue
  if (!inChannel.available) {
    return `输入形状中的通道数未知`
  }
  if (inChannel.value != parameters.num_features) {
    return `输入形状中的通道数 ${inChannel.value} 与参数中通道数 ${parameters.num_features} 不匹配`
  }
  return null
}
export const checkInFeatures: LayerChecker<{ in_features: number }> = (
  inputShapes: DynamicShapeConnected[],
  parameters: { in_features: number },
) => {
  const [, inChannel] = inputShapes[0].shapeValue
  if (!inChannel.available) {
    return `输入形状中的特征向量的长度未知`
  }
  if (inChannel.value != parameters.in_features) {
    return `输入形状中的特征向量的长度 ${inChannel.value} 与参数中特征向量的长度 ${parameters.in_features} 不匹配`
  }
  return null
}

export const check1DKernelSize: LayerChecker<Base1DKernelParameters> = (
  inputShapes: DynamicShapeConnected[],
  parameters: Base1DKernelParameters,
) => {
  const [, , length] = inputShapes[0].shapeValue
  if (
    length.available &&
    length.value - parameters.kernel_size + 2 * parameters.padding < 0
  ) {
    return `输入形状中的长度过小，无法进行卷积运算`
  }
  return null
}

export const check2DKernelSize: LayerChecker<Base2DKernelParameters> = (
  inputShapes: DynamicShapeConnected[],
  parameters: Base2DKernelParameters,
) => {
  const [, , inHeight, inWidth] = inputShapes[0].shapeValue
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
}