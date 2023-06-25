import { joyTheme } from '@/theme'
import { ConnectorSide, ConnectorType } from '@/types/config/deepLearning'
import { Container, G, Line, Rect, Text } from '@svgdotjs/svg.js'
import { scene } from './scene'

const LINE_WIDTH = 4
const CONNECTOR_LENGTH = 40
const CONNECTOR_PADDING = [10, 4]

const connectorDirectionMap: Record<ConnectorSide, [number, number]> = {
  left: [-CONNECTOR_LENGTH, 0],
  right: [CONNECTOR_LENGTH, 0],
  top: [0, -CONNECTOR_LENGTH],
  bottom: [0, CONNECTOR_LENGTH],
}

const { palette } = joyTheme.vars

const ISOLATED_COLOR = palette.neutral[800]
const CONNECTED_COLOR = palette.primary[500]

export class Connector {
  public connector: G
  public line: Line

  public end: G
  public text: Text
  public pill: Rect

  disabled = false
  connectedConnector: Connector | null = null

  constructor(
    layer: Container,
    label: string,
    public readonly side: ConnectorSide,
    public readonly type: ConnectorType,
    public acceptedShape: string[] = [],
  ) {
    this.connector = layer.group().addClass('connector')

    const endPos = connectorDirectionMap[side]
    this.line = this.connector
      .line([[0, 0], endPos])
      .stroke({ width: LINE_WIDTH, color: ISOLATED_COLOR, linecap: 'round' })
    this.end = this.connector.group().translate(...endPos)
    this.pill = this.end.rect().fill(ISOLATED_COLOR)
    this.text = this.end.text('').font({ size: 18 }).fill('#FFF')

    this.label(label)

    this.end.on('mousedown', this.startDragging.bind(this))
  }

  label(label: string) {
    this.text.text(label).center(0, 0)

    const textBBox = this.text.bbox()
    const { width: textWidth, height: textHeight } = textBBox
    const width = textWidth + CONNECTOR_PADDING[0] * 2,
      height = textHeight + CONNECTOR_PADDING[1] * 2

    this.pill
      .width(width)
      .height(height)
      .radius(height / 2)
      .center(0, 0)

    return this
  }
  move(x: number, y: number) {
    this.connector.translate(x, y)
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

  connect(peer: Connector) {
    if (this.connectedConnector) return
    this.connectedConnector = peer
    if (this.type == 'input') {
      this.connector.hide()
    }
    return this
  }
  disconnect() {
    if (!this.connectedConnector) return
    this.connectedConnector = null
    if (this.type == 'input') {
      this.connector.show()
    }
    return this
  }

  startDragging(e: Event) {
    e.stopPropagation()
    this.connector.addClass('dragging')
    const { x, y, width, height } = this.end.rbox()
    const dragging = new DragConnector([x + width / 2, y + height / 2])
    dragging.startListen(() => {
      this.connector.removeClass('dragging')
    })
  }
}

export class DragConnector {
  startPoint: [number, number]
  dashedLine: Line

  constructor(startPoint: [number, number]) {
    this.startPoint = startPoint
    this.dashedLine = scene
      .line([startPoint, startPoint])
      .stroke({ width: LINE_WIDTH, dasharray: '2,8', color: '#888', linecap: 'round' })
  }

  startListen(restore: () => void) {
    const { x: offsetX, y: offsetY } = scene.rbox()
    const moveHandler = (e: MouseEvent) => {
      this.updateLine([e.clientX - offsetX, e.clientY - offsetY])
    }
    const endHandler = () => {
      window.removeEventListener('mousemove', moveHandler)
      window.removeEventListener('mouseup', endHandler)
      this.dispose()
      restore()
    }
    window.addEventListener('mousemove', moveHandler)
    window.addEventListener('mouseup', endHandler)

    return this
  }

  updateLine(endPoint: [number, number]) {
    this.dashedLine.plot([this.startPoint, endPoint])
    return this
  }

  dispose() {
    this.dashedLine.remove()
  }
}
