import { Box, Element } from "@svgdotjs/svg.js"
import { ShapeParameter } from "./parameter"

export type ConnectorSide = 'top' | 'bottom' | 'left' | 'right'
export interface ConnectorOrigin {
  side: ConnectorSide
  pos: [number, number]
}

export type ConnectorStatus = 'isolated' | 'connected' | 'dragging'
export type ConnectorType = 'input' | 'output'

export interface ConnectorConfig {
  origin: ConnectorOrigin
  type: ConnectorType
  shape: ShapeParameter
}
export interface LayerConfig {
  name: string
  renderer: (box: Box) => Element
  connectors: (parameters: Record<string, string>) => ConnectorConfig[]
}

export interface VirtualValue {
  value: number
  virtual: boolean
}
export interface ShapeCalculatingEnv {
  inputShape: VirtualValue[]
  parameters: Record<string, string>
}
