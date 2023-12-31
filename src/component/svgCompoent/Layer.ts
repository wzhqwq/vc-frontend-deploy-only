import { Element, G, Rect, SVG, Text } from '@svgdotjs/svg.js'
import {
  DynamicShape,
  DynamicShapeConnected,
  LayerConfig,
  LayerData,
} from '@/types/config/deepLearning'
import { CONNECTOR_H_HEIGHT, CONNECTOR_LENGTH, CONNECTOR_PILL_HEIGHT, Connector } from './Connector'
import { ConfigParameterRecord } from '@/types/config/parameter'
import { nanoid } from 'nanoid'
import { LayoutLayer } from './Layout'
import { Scene } from './Scene'
import { joyTheme } from '@/theme'

const MIN_HEIGHT = 80
const MIN_WIDTH = 140
const CONNECTOR_GAP_X = 20
const CONNECTOR_GAP_Y = 10
const SMALL_LAYER_WIDTH = 100
const SMALL_LAYER_HEIGHT = 60

const ERROR_COLOR = joyTheme.vars.palette.danger[500]

const getWidthOfHorizontalConnectors = (connectors: Connector[]) =>
  connectors.length
    ? connectors.reduce((acc, c) => acc + c.pillWidth + CONNECTOR_GAP_X, 0) - CONNECTOR_GAP_X
    : 0
const getHeightOfHorizontalConnectors = (connectors: Connector[]) =>
  connectors.length ? CONNECTOR_H_HEIGHT : 0
const getWidthOfVerticalConnectors = (connectors: Connector[]) =>
  connectors.length ? Math.max(...connectors.map((c) => c.pillWidth)) + CONNECTOR_LENGTH : 0
const getHeightOfVerticalConnectors = (connectors: Connector[]) =>
  connectors.length
    ? connectors.length * CONNECTOR_PILL_HEIGHT + (connectors.length - 1) * CONNECTOR_GAP_Y
    : 0

export class Layer<P extends ConfigParameterRecord = any> {
  public static readonly layers = new Map<string, Layer>()
  public readonly id: string
  public row: number
  public readonly src: string

  public readonly el: G
  public readonly boundary: Rect
  private shape: Element | null = null
  private text: Text
  private readonly errorBubble: Rect
  private readonly errorText: Text

  public layout: LayoutLayer | null = null
  public scene: Scene | null = null

  private offsetX = 0
  private offsetY = 0
  private lastX = 0
  private lastY = 0
  public x = 0
  public y = 0
  public width = 0
  public height = 0

  public readonly connectors: Connector[]

  private inputShapes: DynamicShape[]
  public parameters: P

  constructor(
    public readonly config: LayerConfig<P>,
    data?: LayerData<P>,
  ) {
    this.el = new G().addClass('layer')
    this.parameters = data?.parameters ?? config.defaultParameters
    this.id = data?.id ?? nanoid()
    this.row = data?.row ?? 0
    this.inputShapes = config.inputs.map(() => ({ connected: false }))

    this.boundary = this.el.rect().fill('transparent')
    this.text = this.el
      .text(this.config.displayName ?? this.config.name)
      .font({ size: 14 })
      .fill(this.config.renderer.color == 'dark' ? '#FFF' : '#000')
    // 先生成一个小型预览图，用于拖拽
    this.boundary.size(SMALL_LAYER_WIDTH, SMALL_LAYER_HEIGHT)
    this.text.center(SMALL_LAYER_WIDTH / 2, SMALL_LAYER_HEIGHT / 2)
    this.renderShape()
    this.src =
      'data:image/svg+xml;base64,' +
      btoa(SVG().size(SMALL_LAYER_WIDTH, SMALL_LAYER_HEIGHT).add(this.el.clone()).svg())

    this.errorBubble = this.el.rect().fill(ERROR_COLOR).radius(5)
    this.errorText = this.el.text('').font({ size: 12 }).fill('#FFF')

    let ids = data
      ? [...data.inputs, ...data.outputs].map((c) => c.id)
      : new Array(config.inputs.length + config.outputs.length)
          .fill('')
          .map((_, i) => this.id + '-' + i)
    this.connectors = [...config.inputs, ...config.outputs].map(
      (c, i) => new Connector(this, ids[i], c.side, c.type, c.shape),
    )
    if (!data) {
      this.connectors.forEach((c) => c.update(this.inputShapes, this.parameters))
      this.updateLayout()
    }

    this.el.on('mousedown', () => {
      this.el.addClass('dragging')
      this.scene?.setPossibleDraggingLayer(this)
    })
    this.el.on('mouseup', () => {
      this.el.removeClass('dragging')
      this.scene?.setPossibleDraggingLayer(null)
    })
    this.el.on('click', () => {
      this.scene?.setSelectedLayer(this)
    })

    Layer.layers.set(this.id, this)
  }

  public initializeConnectors(data: LayerData<P>) {
    let i = 0
    this.connectors.forEach((c) => {
      c.update(this.inputShapes, this.parameters)
      if (c.type != 'input') return

      if (data.inputs[i].peer) {
        c.connectById(data.inputs[i].peer!)
      }
      i++
    })
    this.updateLayout()
  }

  public toJSON(): LayerData<P> {
    let inputConnectors = this.connectors.filter((c) => c.type == 'input')
    let outputConnectors = this.connectors.filter((c) => c.type == 'output')
    return {
      id: this.id,
      name: this.config.name,
      parameters: this.parameters,
      inputs: inputConnectors.map((c) => ({ id: c.id, peer: c.peer?.id })),
      outputs: outputConnectors.map((c) => ({ id: c.id, peer: c.peer?.id })),
      row: this.row,
    }
  }
  public toImageSrc() {
    return (
      'data:image/svg+xml;base64,' +
      btoa(
        SVG()
          .size(this.width, this.height)
          .add(this.el.clone().translate(this.offsetX, this.offsetY))
          .svg(),
      )
    )
  }
  public updateParameters(parameters: P) {
    const parametersInShape = this.config.parameters.filter((p) => p.inShape)
    const updateConnectors = parametersInShape.some(
      (p) => parameters[p.key] != this.parameters[p.key],
    )
    this.parameters = parameters
    this.checkAndUpdate(updateConnectors)
  }
  public updateInputShapes() {
    this.inputShapes = this.connectors
      .filter((c) => c.type == 'input')
      .map((c) =>
        c.peer && c.shapeValue
          ? {
              connected: true,
              shapeValue: c.shapeValue!,
            }
          : { connected: false },
      )
    this.checkAndUpdate()
  }
  private checkAndUpdate(updateNeeded = true) {
    const inputShapes = this.inputShapes
    if (inputShapes.every((s): s is DynamicShapeConnected => s.connected) && this.config.checkers) {
      const error = this.config.checkers.map((c) => c(inputShapes, this.parameters)).find((e) => e)
      const center = [this.width / 2 - this.offsetX, this.height / 2 - this.offsetY] as [
        number,
        number,
      ]
      if (error) {
        this.errorText
          .text(error)
          .show()
          .center(...center)
        this.errorBubble
          .size(this.errorText.bbox().width + 10, this.errorText.bbox().height + 10)
          .show()
          .center(...center)
          .front()
        this.errorText.front()
      } else {
        this.errorBubble.hide()
        this.errorText.hide()
      }
    } else {
      this.errorBubble.hide()
      this.errorText.hide()
    }
    if (updateNeeded) {
      this.connectors.forEach((c) => c.update(inputShapes, this.parameters))
      this.updateLayout()
      this.layout?.updateLayout()
    }
  }
  public remove() {
    this.scene?.removeLayer(this)
  }

  public has(connector: Connector) {
    return connector.id.startsWith(this.id)
  }

  private updateLayout() {
    const topConnectors = this.connectors.filter((c) => c.side == 'top')
    const bottomConnectors = this.connectors.filter((c) => c.side == 'bottom')
    const leftConnectors = this.connectors.filter((c) => c.side == 'left')
    const rightConnectors = this.connectors.filter((c) => c.side == 'right')

    const topWidth = getWidthOfHorizontalConnectors(topConnectors)
    const bottomWidth = getWidthOfHorizontalConnectors(bottomConnectors)
    const leftHeight = getHeightOfVerticalConnectors(leftConnectors)
    const rightHeight = getHeightOfVerticalConnectors(rightConnectors)
    const innerWidth = Math.max(MIN_WIDTH, Math.max(topWidth, bottomWidth))
    const innerHeight = Math.max(MIN_HEIGHT, Math.max(leftHeight, rightHeight))

    this.offsetX = getWidthOfVerticalConnectors(leftConnectors)
    this.offsetY = getHeightOfHorizontalConnectors(topConnectors)
    this.width = innerWidth + this.offsetX + getWidthOfVerticalConnectors(rightConnectors)
    this.height = innerHeight + this.offsetY + getHeightOfHorizontalConnectors(bottomConnectors)

    topConnectors.reduce(
      (x, c) => {
        c.move(x, 0)
        return x + c.pillWidth + CONNECTOR_GAP_X
      },
      (innerWidth - topWidth) / 2 + (topConnectors.at(0)?.pillWidth ?? 0) / 2,
    )
    bottomConnectors.reduce(
      (x, c) => {
        c.move(x, innerHeight)
        return x + c.pillWidth + CONNECTOR_GAP_X
      },
      (innerWidth - bottomWidth) / 2 + (bottomConnectors.at(0)?.pillWidth ?? 0) / 2,
    )
    leftConnectors.reduce(
      (y, c) => {
        c.move(0, y)
        return y + CONNECTOR_PILL_HEIGHT + CONNECTOR_GAP_Y
      },
      (innerHeight - leftHeight) / 2 + CONNECTOR_PILL_HEIGHT / 2,
    )
    rightConnectors.reduce(
      (y, c) => {
        c.move(innerWidth, y)
        return y + CONNECTOR_PILL_HEIGHT + CONNECTOR_GAP_Y
      },
      (innerHeight - rightHeight) / 2 + CONNECTOR_PILL_HEIGHT / 2,
    )

    this.boundary.size(innerWidth, innerHeight)
    this.text.center(innerWidth / 2, innerHeight / 2)
    this.renderShape()
  }

  private renderShape() {
    if (this.shape) {
      this.shape.remove()
    }
    this.shape = this.config.renderer.getElement(this.boundary.bbox())
    this.el.add(this.shape)
    this.text.front()
  }

  public updatePosition(x: number, y: number) {
    this.x = x + this.offsetX
    this.y = y + this.offsetY
    return this
  }

  public moveAnimated() {
    this.el.animate().transform({
      translate: [this.x - this.lastX, this.y - this.lastY],
    }, true)
    this.lastX = this.x
    this.lastY = this.y
  }

  public dispose() {
    this.el.remove()
    this.connectors.forEach((c) => c.dispose())
    this.layout = this.scene = null
    Layer.layers.delete(this.id)
  }
  public cleanup() {
    this.connectors.forEach((c) => c.cleanup())
    this.layout = this.scene = null
  }
}
