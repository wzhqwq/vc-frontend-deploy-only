import { ConnectorOriginName, ConnectorOrigin } from "@/types/config/deepLearning";

export const connectorOrigins: Record<ConnectorOriginName, ConnectorOrigin> = {
  topLeft: { facing: 'top', getPos: () => [20, 0] },
  topRight: { facing: 'top', getPos: box => [box.width - 20, 0] },
  topCenter: { facing: 'top', getPos: box => [box.width / 2, 0] },
  bottomLeft: { facing: 'bottom', getPos: box => [20, box.height] },
  bottomRight: { facing: 'bottom', getPos: box => [box.width - 20, box.height] },
  bottomCenter: { facing: 'bottom', getPos: box => [box.width / 2, box.height] },
}
