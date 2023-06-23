import { joyTheme } from '@/theme'
import { Container, G, Line, Rect, Text } from '@svgdotjs/svg.js'

const LINE_WIDTH = 2
const CONNECTOR_LENGTH = 10
const CONNECTOR_PADDING = 10

const { palette } = joyTheme.vars

const ISOLATED_COLOR = palette.neutral[800]
const CONNECTED_COLOR = palette.primary[500]

export type ConnectorFacing = 'top' | 'bottom'
const connectorFacingMap: Record<ConnectorFacing, [number, number]> = {
  // left: [-1, 0],
  // right: [1, 0],
  top: [0, -1],
  bottom: [0, 1],
}

export interface ConnectorOrigin {
  facing: ConnectorFacing
  translate: string
}

export type ConnectorStatus = 'isolated' | 'connected' | 'dragging'
export type ConnectorType = 'input' | 'output'

export class Connector {
  public connector: G
  public line: Line
  public text: Text
  public pill: Rect

  disabled = false
  
  constructor(
    layer: Container,
    label: string,
    origin: ConnectorOrigin,
    public type: ConnectorType,
    public acceptedShape: string[] = []
  ) {
    this.connector = layer
      .group()
      .css('transform', `translate(${origin.translate})`)
      .addClass('connector')

    this.line = this.connector
      .line([
        [0, 0],
        connectorFacingMap[origin.facing].map((n) => n * CONNECTOR_LENGTH) as [number, number],
      ])
      .stroke({ width: LINE_WIDTH })
    this.text = this.connector.text('').font({ size: 12 }).fill('#FFF')
    this.pill = this.connector.rect().fill(ISOLATED_COLOR)

    this.label(label)
  }

  label(label: string) {
    this.text.text(label)

    const textBBox = this.text.bbox()
    const { width: textWidth, height: textHeight } = textBBox
    const width = textWidth + CONNECTOR_PADDING * 2,
      height = textHeight + CONNECTOR_PADDING * 2
    const labelY = CONNECTOR_LENGTH + height / 2

    this.text.center(0, labelY)

    this.pill
      .width(width)
      .height(height)
      .radius(height / 2)
      .center(0, labelY)

    return this
  }

  disable() {
    this.disabled = true
    this.connector.addClass('disabled')
    return this
  }
  enable() {
    this.disabled = false
    this.connector.removeClass('disabled')
    return this
  }
}

export class DragConnector {
  startPoint: [number, number]
  dashedLine: Line

  constructor(scene: Container, startPoint: [number, number]) {
    this.startPoint = startPoint
    this.dashedLine = scene
      .line([startPoint, startPoint])
      .stroke({ width: LINE_WIDTH, dasharray: '5,5' })
  }
}
