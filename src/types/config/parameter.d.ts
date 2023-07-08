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
  inOptions?: boolean
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
  | 'm'
  | 'n'
  | 'k'

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

export interface PreProcessWithoutLabelParameter {
  /**
   * 数据处理配置，随data_type变化（注意是anyOf，不是数组）
   */
  data_config: any
  /**
   * 数据类型，用户上传数据集的类型有四种数据类型 1、image 2、text 3、bioSeq 4、other.分别用1 2 3 4表示
   */
  data_type: number
  /**
   * 文件url，数据集文件所在路径
   */
  file_URI: string
  /**
   * 学习类型，false表示无标签 true表示有标签
   */
  learn_kind: false
}
export interface PreProcessWithLabelParameter {
  /**
   * 数据处理配置，随data_type变化（注意是anyOf，不是数组）
   */
  data_config: any
  /**
   * 数据类型，用户上传数据集的类型有四种数据类型 1、image 2、text 3、bioSeq 4、other.分别用1 2 3 4表示
   */
  data_type: number
  /**
   * 文件url，数据集文件所在路径
   */
  file_URI: string
  /**
   * 标签配置，只有生物数据和图片数据有
   */
  label_config: LabelParameter
  /**
   * 标签文件路径，用户选择1时才需要这个参数
   */
  label_path: string
  /**
   * 学习类型，false表示无标签 true表示有标签
   */
  learn_kind: true
}
export type PreProcessParameter = PreProcessWithoutLabelParameter | PreProcessWithLabelParameter

/**
 * 标签配置，只有生物数据和图片数据有
 */
export interface TxtLabelParameter {
  /**
   * 文件类型，取值 txt mat
   */
  file_type: 'txt'
}
export interface MatLabelParameter {
  /**
   * 文件类型，取值 txt mat
   */
  file_type: 'mat'
  /**
   * 矩阵名，文件类型是mat时指定label矩阵的name
   */
  mat_name: string
}
export type LabelParameter = TxtLabelParameter | MatLabelParameter
