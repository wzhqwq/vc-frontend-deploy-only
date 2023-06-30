import { Box, Element } from "@svgdotjs/svg.js"
import { LayerParameters, ShapeParameter } from "./parameter"

export type ConnectorSide = 'top' | 'bottom' | 'left' | 'right'
export type ConnectorStatus = 'isolated' | 'connected' | 'dragging'
export type ConnectorType = 'input' | 'output'

export interface ConnectorConfig<P extends LayerParameters> {
  type: ConnectorType
  side: ConnectorSide
  shape: ShapeParameter<P>
}
export interface LayerConfig<P extends LayerParameters> {
  name: string
  displayName?: string
  renderer: (box: Box) => Element
  inputs: ConnectorConfig<P>[]
  outputs: ConnectorConfig<P>[]
  defaultParameters: P
  shapeChecker: (inputShapes: DynamicShape[], parameters: P) => string | null
  color: 'dark' | 'light'
}

export interface VirtualValue {
  value: number
  virtual: boolean
  available: boolean
}
export interface DynamicShape {
  shapeValue: VirtualValue[]
  connected: boolean
}

export interface LayerData<P extends LayerParameters> {
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
