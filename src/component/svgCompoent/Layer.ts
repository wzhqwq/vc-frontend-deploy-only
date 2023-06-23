import { Container, G } from "@svgdotjs/svg.js"
import { ConnectorOrigin } from "./Connector"

export type ConnectorOriginName =
  | 'topLeft'
  | 'topRight'
  | 'topCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'bottomCenter'
export const connectorOrigins: Record<ConnectorOriginName, ConnectorOrigin> = {
  topLeft: { facing: 'top', translate: '20px,0' },
  topRight: { facing: 'top', translate: 'calc(100%-20px),0' },
  topCenter: { facing: 'top', translate: '50%,0' },
  bottomLeft: { facing: 'bottom', translate: '20px,100%' },
  bottomRight: { facing: 'bottom', translate: 'calc(100%-20px),100%' },
  bottomCenter: { facing: 'bottom', translate: '50%,100%' },
}

export class Layer {
  public layer: G
  constructor(scene: Container) {
    this.layer = scene.group().addClass('layer')
  }
}
