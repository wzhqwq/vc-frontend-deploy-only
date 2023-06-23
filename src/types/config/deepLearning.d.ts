import { Box, Element } from "@svgdotjs/svg.js"
import { ShapeParameter } from "./parameter"

export type ConnectorFacing = 'top' | 'bottom'
export interface ConnectorOrigin {
  facing: ConnectorFacing
  getPos(box: Box): [number, number]
}

export type ConnectorStatus = 'isolated' | 'connected' | 'dragging'
export type ConnectorType = 'input' | 'output'

export type ConnectorOriginName =
  | 'topLeft'
  | 'topRight'
  | 'topCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'bottomCenter'

export interface ConnectorConfig {
  origin: ConnectorOriginName
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
