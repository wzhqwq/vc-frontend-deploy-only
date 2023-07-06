import { Box, Element } from '@svgdotjs/svg.js'
import {
  EachTypeOfConfigParameter,
  ConfigParameter,
  FlatConfigParameters,
  ShapeParameter,
} from './parameter'

export type ConnectorSide = 'top' | 'bottom' | 'left' | 'right'
export type ConnectorStatus = 'isolated' | 'connected' | 'dragging'
export type ConnectorType = 'input' | 'output'

export interface ConnectorConfig<P extends FlatConfigParameters> {
  type: ConnectorType
  side: ConnectorSide
  shape: ShapeParameter<P>
}
export type LayerChecker<P extends FlatConfigParameters> = (
  inputShapes: DynamicShapeConnected[],
  parameters: P,
) => string | null
export interface LayerConfig<P extends FlatConfigParameters> {
  name: string
  displayName?: string
  renderer: LayerRenderer
  inputs: ConnectorConfig<P>[]
  outputs: ConnectorConfig<P>[]
  defaultParameters: P
  parameters: EachTypeOfConfigParameter<keyof P>[]
  checkers?: LayerChecker<P>[]
}
export interface LayerRenderer {
  getElement: (box: Box) => Element
  color: 'dark' | 'light'
}
export type CreateLayerConfigOptions<P extends FlatConfigParameters> = Omit<
  LayerConfig<P>,
  'defaultParameters'
>

export interface VirtualValue {
  value: number
  virtual: boolean
  available: boolean
}
export interface DynamicShapeConnected {
  shapeValue: VirtualValue[]
  connected: true
}
export interface DynamicShapeUnconnected {
  connected: false
}
export type DynamicShape = DynamicShapeConnected | DynamicShapeUnconnected

export interface LayerData<P extends FlatConfigParameters> {
  id: string
  name: string
  parameters: P
  inputs: ConnectorData[]
  outputs: ConnectorData[]
  row: number
}
export interface ConnectorData {
  id: string
  peer?: string
}
