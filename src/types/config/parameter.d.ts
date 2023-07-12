import { DynamicShape, VirtualValue } from './deepLearning'

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never
export type ConfigParameterType =
  | 'int'
  | 'float'
  | 'str'
  | 'file'
  | 'bool'
  | 'tuple2'
  | 'tuple3'
  | 'dict'
  | 'list'
export type ConfigParameterValue<T extends ConfigParameterType> = T extends 'int' | 'float'
  ? number
  : T extends 'str' | 'file'
  ? string
  : T extends 'bool'
  ? boolean
  : T extends 'tuple2'
  ? [number, number]
  : T extends 'tuple3'
  ? [number, number, number]
  : T extends 'dict'
  ? undefined
  : T extends 'list'
  ? any[]
  : never

export type ConfigParameterRecord = Record<string, ConfigParameterValue<ConfigParameterType>>

export interface ConfigParameter<
  Parent extends Record<string | number | symbol, any>,
  Key extends keyof Parent,
  Type extends ConfigParameterType,
> {
  key: Key
  type: Type
  description: string
  inShape?: boolean
  default: Parent[Key] extends Array ? ArrayElement<Parent[Key]> : Parent[Key]
  // 当前值的可选值
  selections?: string[]
  validator?: (value: Exclude<Parent[Key], string | number>) => boolean
  canShow?: (parameters: Parent) => boolean
}
export interface DictConfigParameter<
  Parent extends Record<string | number | symbol, any>,
  Key extends keyof Parent,
> extends ConfigParameter<Parent, Key, 'dict'> {
  multiChoice: false
  properties: ConfigParameterArray<
    Parent[Key] extends Array ? ArrayElement<Parent[Key]> : Exclude<Parent[Key], string | number>
  >
}
export interface MultiChoiceDictConfigParameter<
  Parent extends Record<string | number | symbol, any>,
  Key extends keyof Parent,
> extends ConfigParameter<Parent, Key, 'dict'> {
  multiChoice: true
  // 当前值由boundSelectionKey从availableValues中选择
  availableValues: Array<DictConfigParameter<Parent, Key>>
  getSelectionIndex: (parameters: Parent) => number
}
export interface ListConfigParameter<
  Parent extends Record<string | number | symbol, any>,
  Key extends keyof Parent,
> extends ConfigParameter<Parent, Key, 'list'> {
  model: DictConfigParameter<Parent, Key>
}
export type EachTypeOfConfigParameter<
  Parent extends Record<string | number | symbol, any>,
  Key extends keyof Parent,
> =
  | ConfigParameter<Parent, Key, 'int'>
  | ConfigParameter<Parent, Key, 'float'>
  | ConfigParameter<Parent, Key, 'str'>
  | ConfigParameter<Parent, Key, 'bool'>
  | ConfigParameter<Parent, Key, 'tuple2'>
  | ConfigParameter<Parent, Key, 'tuple3'>
  | ConfigParameter<Parent, Key, 'file'>
  | DictConfigParameter<Parent, Key>
  | MultiChoiceDictConfigParameter<Parent, Key>
  | ListConfigParameter<Parent, Key>
export type ConfigParameterArray<Parent extends Record<string | number | symbol, any>> =
  EachTypeOfConfigParameter<Parent, keyof Parent | any>[]

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

export interface PreprocessParameter<T extends Record<string, any>, N extends number> {
  data_config: T
  data_type: N
  data_file_name: string
}
