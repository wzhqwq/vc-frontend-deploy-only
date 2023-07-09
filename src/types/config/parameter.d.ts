import { DynamicShape, VirtualValue } from './deepLearning'

export type ConfigParameterType = 'int' | 'float' | 'str' | 'bool' | 'tuple2' | 'object'
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
  : undefined
export type ConfigParameterRecord = Record<string, ConfigParameterValue<ConfigParameterType>>

export interface ConfigParameter<T extends ConfigParameterType, K extends string = string, P = any> {
  key: K
  type: T
  description: string
  inShape?: boolean
  default: ConfigParameterValue<T>/*  | ((parameters: ConfigParameterRecord) => ConfigParameterValue<T>) */
  selections?: string[]
  validator?: (value: ConfigParameterValue<T>) => boolean
  properties: T extends 'object' ? EachTypeOfConfigParameter<keyof P[K], P[K]> : undefined
}
export type EachTypeOfConfigParameter<K extends string = string, P = any> =
  | ConfigParameter<'int', K>
  | ConfigParameter<'float', K>
  | ConfigParameter<'str', K>
  | ConfigParameter<'bool', K>
  | ConfigParameter<'tuple2', K>
  | ConfigParameter<'object', K>
export type ConfigParameterArray<P> = EachTypeOfConfigParameter<keyof P, P>[]

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

type ShapeGetter<P extends ConfigParameterRecord> = (
  inputs: DynamicShape[],
  parameters: P,
) => VirtualValue[] | undefined
export interface FixedDimensionShapeParameter<P extends ConfigParameterRecord> {
  anyDimension?: false
  placeholders: AllShapePlaceholders[]
  getShape: ShapeGetter<P>
}
export interface AnyDimensionShapeParameter<P extends ConfigParameterRecord> {
  anyDimension: true
  getShape: ShapeGetter<P>
}
export type ShapeParameter<P extends ConfigParameterRecord> =
  | FixedDimensionShapeParameter<P>
  | AnyDimensionShapeParameter<P>

export interface PreprocessParameter<T extends Record<string, any>, N extends 1 | 2 | 3 | 4> {
  data_config: T
  data_type: N
  data_file_name: string
}
