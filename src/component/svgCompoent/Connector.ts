import { joyTheme } from '@/theme'
import {
  ConnectorSide,
  ConnectorType,
  DynamicShape,
  VirtualValue,
} from '@/types/config/deepLearning'
import { G, Line, Rect } from '@svgdotjs/svg.js'
import { FlatConfigParameters, ShapeParameter } from '@/types/config/parameter'
import { Label } from './Label'
import { Layer } from './Layer'
import { Scene } from './Scene'
import { LayoutEndPoint } from './Layout'
import { css } from '@emotion/css'

export type ConnectorPoints = [endPos: [number, number], cornerPos: [number, number]]

export const LINE_WIDTH = 4
export const CONNECTOR_LENGTH = 40
const CONNECTOR_PILL_PAD_X = 10
export const CONNECTOR_PILL_HEIGHT = 30
export const CONNECTOR_H_HEIGHT = CONNECTOR_LENGTH + CONNECTOR_PILL_HEIGHT / 2

const connectorDirectionMap: Record<ConnectorSide, [number, number]> = {
  left: [-CONNECTOR_LENGTH, 0],
  right: [CONNECTOR_LENGTH, 0],
  top: [0, -CONNECTOR_LENGTH],
  bottom: [0, CONNECTOR_LENGTH],
}

const { palette } = joyTheme.vars

const ISOLATED_COLOR = palette.neutral[500]
const CONNECTED_COLOR = palette.primary[500]

export class Connector<P extends FlatConfigParameters = any> {
  public static readonly connectors = new Map<string, Connector>()

  private el: G
  private line: Line
  public readonly end: G
  public readonly label: Label<P>
  private pill: Rect

  private x = 0
  private y = 0
  private endPos: [number, number]
  public pillWidth = 0

  private disabled = false
  private connectedConnector: Connector | null = null
  public endPoint: LayoutEndPoint | null = null

  public readonly shapeDimension: number
  public shapeValue: VirtualValue[] | undefined = undefined

  constructor(
    public readonly layer: Layer<P>,
    public readonly id: string,
    public readonly side: ConnectorSide,
    public readonly type: ConnectorType,
    private readonly shapeParameter: ShapeParameter<P>,
  ) {
    this.shapeDimension = shapeParameter.anyDimension ? -1 : shapeParameter.placeholders.length
    this.el = layer.el
      .group()
      .addClass('connector')
      .addClass(`connector-${side}`)
      .addClass(`connector-${type}`)
      .addClass(`connector-${type}-${this.shapeDimension == -1 ? 'any' : this.shapeDimension}d`)

    this.endPos = connectorDirectionMap[side]
    this.line = this.el
      .line([[0, 0], this.endPos])
      .stroke({ width: LINE_WIDTH, color: ISOLATED_COLOR, linecap: 'round' })
    this.end = this.el.group().translate(...this.endPos)
    this.pill = this.end
      .rect()
      .fill(ISOLATED_COLOR)
      .radius(CONNECTOR_PILL_HEIGHT / 2)
    this.label = new Label(this.end, shapeParameter)

    this.end.on('mousedown', this.startDragging.bind(this))
    this.end.on('mouseup', this.dropped.bind(this))

    Connector.connectors.set(id, this)
  }

  update(inputs: DynamicShape[], parameters: P) {
    this.shapeValue = this.shapeParameter.getShape(inputs, parameters)
    if (this.type == 'output' && this.peer) {
      this.peer.shapeValue = this.shapeValue
      this.peer.layer.updateInputShapes()
    }
    const textBBox = this.label.update(this.shapeValue).center(0, 0).bbox()
    const { width: textWidth } = textBBox
    this.pillWidth = textWidth + CONNECTOR_PILL_PAD_X * 2

    this.pill.width(this.pillWidth).height(CONNECTOR_PILL_HEIGHT).center(0, 0)

    return this
  }
  move(x: number, y: number) {
    this.el.attr({ transform: `translate(${x}, ${y})` })
    this.x = x
    this.y = y
    return this
  }
  get points() {
    return [
      [this.x, this.y],
      [this.x + this.endPos[0], this.y + this.endPos[1]],
    ] as ConnectorPoints
  }

  disable() {
    this.disabled = true
    this.el.addClass('disabled')
    return this
  }
  enable() {
    this.disabled = false
    this.el.removeClass('disabled')
    return this
  }

  connect(peer: Connector<any>) {
    if (this.connectedConnector) return
    this.connectedConnector = peer
    this.line.stroke({ color: CONNECTED_COLOR })
    this.pill.fill(CONNECTED_COLOR)
    this.el.addClass('connected')
    if (this.type == 'input') {
      this.shapeValue = peer.shapeValue
      this.layer.updateInputShapes()
    }
    return this
  }
  disconnect() {
    if (!this.connectedConnector) return
    this.connectedConnector = null
    this.line.stroke({ color: ISOLATED_COLOR })
    this.pill.fill(ISOLATED_COLOR)
    this.el.removeClass('connected')
    if (this.type == 'input') {
      this.shapeValue = undefined
      this.layer.updateInputShapes()
    }
    return this
  }
  get peer() {
    return this.connectedConnector
  }
  connectById(id: string) {
    const peer = Connector.connectors.get(id)
    if (!peer) return
    this.connect(peer)
    peer.connect(this)
    return this
  }

  startDragging(e: Event) {
    const scene = this.layer.scene
    if (this.connectedConnector || !scene) return
    e.stopPropagation()
    const targetType = this.type == 'input' ? 'output' : 'input'
    const connectClassName = css`
      .connector:not(.connected) {
        cursor: not-allowed;
        opacity: 0.5;
        &.connector-${targetType + (this.shapeDimension == -1 ? '' : `-${this.shapeDimension}d`)},
          &.connector-${targetType}-anyd {
          cursor: copy;
          opacity: 1;
          &:hover {
            rect {
              transform: scale(1.2);
            }
          }
        }
      }
    `
    scene.el.addClass(connectClassName)

    this.el.addClass('connecting')
    const { cx, cy } = this.end.rbox(scene.el)
    new ConnectorDraggingIndicator([cx, cy], this, scene).startListen(() => {
      scene.el.removeClass(connectClassName)
      this.el.removeClass('connecting')
    })
  }

  dropped() {
    // 注意该函数会在window上注册的事件之前执行，所以无需处理连接后的善后工作
    const peer = ConnectorDraggingIndicator.currentIndicator?.starter
    // 必须存在peer，且不是自己
    if (!peer || peer.id == this.id) return
    // 不能是同一个层
    if (peer.id.split('-')[0] == this.id.split('-')[0]) return
    // 输出对输入
    if (peer.type == this.type) return
    // 张量维度必须相同
    if (
      peer.shapeDimension != -1 &&
      this.shapeDimension != -1 &&
      peer.shapeDimension != this.shapeDimension
    )
      return

    if (this.disabled) return
    if (this.connectedConnector) return

    this.connect(peer)
    peer.connect(this)
    this.endPoint?.resumePath(true)
  }

  public dispose() {
    this.el.remove()
    this.peer?.disconnect()
    this.disconnect()
    this.endPoint?.detach()
    this.endPoint = null
    Connector.connectors.delete(this.id)
  }
  public cleanup() {
    this.endPoint = null
  }
}

export class ConnectorDraggingIndicator {
  static currentIndicator: ConnectorDraggingIndicator | null = null
  dashedLine: Line

  constructor(
    private readonly startPoint: [number, number],
    public readonly starter: Connector,
    private readonly scene: Scene,
  ) {
    this.dashedLine = scene.el
      .line([startPoint, startPoint])
      .stroke({ width: LINE_WIDTH, dasharray: '2,8', color: '#888', linecap: 'round' })
  }

  startListen(restore: () => void) {
    ConnectorDraggingIndicator.currentIndicator = this
    const { x: offsetX, y: offsetY } = this.scene.el.rbox()

    const moveHandler = (e: MouseEvent) => {
      let [x0, y0] = this.startPoint
      let x1 = e.clientX - offsetX,
        y1 = e.clientY - offsetY
      // 需要连接线保持在鼠标周围4px，以下计算新的终点坐标
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
      ConnectorDraggingIndicator.currentIndicator = null
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
