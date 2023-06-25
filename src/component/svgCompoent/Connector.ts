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

const ISOLATED_COLOR = palette.neutral[500]
const CONNECTED_COLOR = palette.primary[500]

const connectors = new Map<string, Connector>()

export class Connector {
  private connector: G
  private line: Line
  private end: G
  private text: Text | null = null
  private pill: Rect

  private disabled = false
  private connectedConnector: Connector | null = null

  constructor(
    layer: Container,
    public readonly id: string,
    public readonly side: ConnectorSide,
    public readonly type: ConnectorType,
    public readonly shapeDimension: number,
  ) {
    this.connector = layer
      .group()
      .addClass('connector')
      .addClass(`connector-${type}-${shapeDimension}d`)

    const endPos = connectorDirectionMap[side]
    this.line = this.connector
      .line([[0, 0], endPos])
      .stroke({ width: LINE_WIDTH, color: ISOLATED_COLOR, linecap: 'round' })
    this.end = this.connector.group().translate(...endPos)
    this.pill = this.end.rect().fill(ISOLATED_COLOR)

    this.end.on('mousedown', this.startDragging.bind(this))
    this.end.on('mouseup', this.dropped.bind(this))
  }

  label(text: Text) {
    if (this.text) this.text.remove()
    this.text = text
    this.end.add(this.text)
    this.text.center(0, 0)

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
    this.line.stroke({ color: CONNECTED_COLOR })
    this.pill.fill(CONNECTED_COLOR).addClass('connected')
    return this
  }
  disconnect() {
    if (!this.connectedConnector) return
    this.connectedConnector = null
    this.line.stroke({ color: ISOLATED_COLOR })
    this.pill.fill(ISOLATED_COLOR).removeClass('connected')
    return this
  }
  get peer() {
    return this.connectedConnector
  }
  connectById(id: string) {
    const peer = connectors.get(id)
    if (!peer) return
    this.connect(peer)
    peer.connect(this)
    return this
  }

  startDragging(e: Event) {
    if (this.connectedConnector) return
    e.stopPropagation()
    scene
      .addClass('connecting-within')
      .addClass(`start-${this.type}-${this.shapeDimension}d`)

    this.connector.addClass('connecting')
    const { x, y, width, height } = this.end.rbox()
    new ConnectorDraggingIndicator([x + width / 2, y + height / 2], this).startListen(() => {
      scene
        .removeClass('connecting-within')
        .removeClass(`start-${this.type}-${this.shapeDimension}d`)
      this.connector.removeClass('connecting')
      ConnectorDraggingIndicator.currentIndicator = null
    })
  }

  dropped() {
    const peer = ConnectorDraggingIndicator.currentIndicator?.starter
    if (!peer || peer == this) return
    if (peer.type == this.type) return
    if (peer.shapeDimension != this.shapeDimension) return

    if (this.disabled) return
    if (this.connectedConnector) return

    this.connect(peer)
    peer.connect(this)
    ConnectorDraggingIndicator.currentIndicator = null
  }
}

export class ConnectorDraggingIndicator {
  static currentIndicator: ConnectorDraggingIndicator | null = null
  dashedLine: Line

  constructor(private readonly startPoint: [number, number], public readonly starter: Connector) {
    this.dashedLine = scene
      .line([startPoint, startPoint])
      .stroke({ width: LINE_WIDTH, dasharray: '2,8', color: '#888', linecap: 'round' })
  }

  startListen(restore: () => void) {
    ConnectorDraggingIndicator.currentIndicator = this
    const { x: offsetX, y: offsetY } = scene.rbox()

    const moveHandler = (e: MouseEvent) => {
      let [x0, y0] = this.startPoint
      let x1 = e.clientX - offsetX,
        y1 = e.clientY - offsetY
      // the line formula: P = P0 + t * (P1 - P0)
      // the circle around point P1: (x - x1)^2 + (y - y1)^2 = r^2
      // the intersection: (x0 + t * (x1 - x0) - x1)^2 + (y0 + t * (y1 - y0) - y1)^2 = r^2
      // equivalent to: (1 - t)^2 * (x1 - x0)^2 + (1 - t)^2 * (y1 - y0)^2 = r^2
      // equivalent to: (1 - t)^2 * = r^2 / ((x1 - x0)^2 + (y1 - y0)^2)
      // solve t: t = 1 - sqrt(r^2 / ((x1 - x0)^2 + (y1 - y0)^2))
      // P = P0 + (1 - sqrt(r^2 / ((x1 - x0)^2 + (y1 - y0)^2))) * (P1 - P0)
      //   = P1 - sqrt(r^2 / (dx^2 + dy^2)) * (P1 - P0)
      let dx = x1 - x0,
        dy = y1 - y0
      let m = Math.sqrt(16 / (dx ** 2 + dy ** 2))
      this.updateLine([x1 - m * dx, y1 - m * dy])
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
