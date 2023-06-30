import { Element, G, Rect, Shape, Text } from '@svgdotjs/svg.js'
import { DynamicShape, LayerConfig, LayerData } from '@/types/config/deepLearning'
import { CONNECTOR_H_HEIGHT, CONNECTOR_LENGTH, CONNECTOR_PILL_HEIGHT, Connector } from './Connector'
import { LayerParameters } from '@/types/config/parameter'
import { nanoid } from 'nanoid'
import { Layout } from './Layout'
import { Scene } from './Scene'

const MIN_HEIGHT = 80
const MIN_WIDTH = 140
const CONNECTOR_GAP_X = 20
const CONNECTOR_GAP_Y = 10

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

export class Layer<P extends LayerParameters = any> {
  public readonly id: string
  public row: number

  public readonly el: G
  public readonly boundary: Rect
  private shape: Element | null = null
  private text: Text

  public layout: Layout | null = null
  public scene: Scene | null = null

  private x = 0
  private y = 0
  private offsetX = 0
  private offsetY = 0
  public width = 0
  public height = 0

  public readonly connectors: Connector[]

  private inputShapes: DynamicShape[] = []
  private parameters: P

  constructor(private config: LayerConfig<P>, data?: LayerData<P>) {
    this.el = new G().addClass('layer')
    this.parameters = data?.parameters ?? config.defaultParameters
    this.id = data?.id ?? nanoid()
    this.row = data?.row ?? 0
    this.inputShapes = config.inputs.map((c) => ({
      shapeValue: new Array(c.shape.placeholders.length).fill({
        value: 0,
        virtual: false,
        available: false,
      }),
      connected: false,
    }))

    let ids = data
      ? [...data.inputs, ...data.outputs].map((c) => c.id)
      : new Array(config.inputs.length + config.outputs.length)
          .fill('')
          .map((_, i) => this.id + '-' + i)
    this.connectors = [...config.inputs, ...config.outputs].map((c, i) => {
      let connector = new Connector(this, ids[i], c.side, c.type, c.shape)
      connector.update(this.inputShapes, this.parameters)
      if (c.type == 'input' && data?.inputs[i].peer) {
        connector.connectById(data.inputs[i].peer!)
      }
      return connector
    })

    this.boundary = this.el.rect().fill('transparent')
    this.text = this.el
      .text(this.config.displayName ?? this.config.name)
      .font({ size: 18 })
      .fill(this.config.color == 'dark' ? '#FFF' : '#000')

    this.updateLayout()

    this.el.on('mousedown', this.mouseDown.bind(this))
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

    topConnectors.reduce((x, c) => {
      c.move(x, 0)
      return x + c.pillWidth + CONNECTOR_GAP_X
    }, (innerWidth - topWidth) / 2 + (topConnectors.at(0)?.pillWidth ?? 0) / 2)
    bottomConnectors.reduce((x, c) => {
      c.move(x, innerHeight)
      return x + c.pillWidth + CONNECTOR_GAP_X
    }, (innerWidth - bottomWidth) / 2 + (bottomConnectors.at(0)?.pillWidth ?? 0) / 2)
    leftConnectors.reduce((y, c) => {
      c.move(0, y)
      return y + CONNECTOR_PILL_HEIGHT + CONNECTOR_GAP_Y
    }, (innerHeight - leftHeight) / 2 + CONNECTOR_PILL_HEIGHT / 2)
    rightConnectors.reduce((y, c) => {
      c.move(innerWidth, y)
      return y + CONNECTOR_PILL_HEIGHT + CONNECTOR_GAP_Y
    }, (innerHeight - rightHeight) / 2 + CONNECTOR_PILL_HEIGHT / 2)

    this.boundary.size(innerWidth, innerHeight)
    this.text.center(innerWidth / 2, innerHeight / 2)
    this.renderShape()
  }

  private renderShape() {
    if (this.shape) {
      this.shape.remove()
    }
    this.shape = this.config.renderer(this.boundary.bbox())
    this.el.add(this.shape)
    this.text.front()
  }

  move(x: number, y: number, animated = false) {
    x += this.offsetX
    y += this.offsetY
    ;(animated ? this.el.animate() : this.el).transform({
      relative: [x, y],
    })
    this.x = x
    this.y = y
    return this
  }

  private mouseDown() {
    this.el.addClass('dragging')
    this.scene?.setPossibleDraggingLayer(this)
  }
}
