import { Container, G, Rect, Shape, Text } from '@svgdotjs/svg.js'
import { DynamicShape, LayerConfig, LayerData } from '@/types/config/deepLearning'
import { Connector } from './Connector'
import { LayerParameters } from '@/types/config/parameter'
import { nanoid } from 'nanoid'
import { Layout } from './Layout'
import { Scene } from './scene'

const MIN_HEIGHT = 80
const MIN_WIDTH = 140
const CONNECTOR_GAP_X = 100
const CONNECTOR_GAP_Y = 40

export class Layer<P extends LayerParameters = any> {
  public readonly id: string
  public row: number

  public readonly el: G
  private boundary: Rect
  private shape: Shape | null = null
  private text: Text

  public layout: Layout | null = null
  public scene: Scene | null = null

  private x = 0
  private y = 0

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
    this.doConnectorLayout()

    this.text = this.el
      .text(this.config.displayName ?? this.config.name)
      .font({ size: 18 })
      .fill('#FFF')
    this.text.center(0, 0)
    this.boundary.center(0, 0)

    this.renderShape()

    this.startDrag = this.startDrag.bind(this)
    this.drag = this.drag.bind(this)
    this.endDrag = this.endDrag.bind(this)

    this.el.on('mousedown', this.startDrag)
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

  private doConnectorLayout() {
    let topConnectors = this.connectors.filter((c) => c.side == 'top')
    let bottomConnectors = this.connectors.filter((c) => c.side == 'bottom')
    let leftConnectors = this.connectors.filter((c) => c.side == 'left')
    let rightConnectors = this.connectors.filter((c) => c.side == 'right')

    let width = Math.max(
      MIN_WIDTH,
      Math.max(topConnectors.length, bottomConnectors.length) * CONNECTOR_GAP_X,
    )
    let height = Math.max(
      MIN_HEIGHT,
      Math.max(leftConnectors.length, rightConnectors.length) * CONNECTOR_GAP_Y,
    )

    let topGap = width / topConnectors.length
    topConnectors.forEach((c, i) => {
      c.move(topGap * (i + 0.5) - width / 2, -height / 2)
    })
    let bottomGap = width / bottomConnectors.length
    bottomConnectors.forEach((c, i) => {
      c.move(bottomGap * (i + 0.5) - width / 2, height / 2)
    })
    let leftGap = height / leftConnectors.length
    leftConnectors.forEach((c, i) => {
      c.move(-width / 2, leftGap * (i + 0.5) - height / 2)
    })
    let rightGap = height / rightConnectors.length
    rightConnectors.forEach((c, i) => {
      c.move(width / 2, rightGap * (i + 0.5) - height / 2)
    })

    this.boundary.size(width, height)
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
    ;(animated ? this.el.animate() : this.el).transform({
      translate: [x - this.x, y - this.y],
    })
    this.x = x
    this.y = y
    return this
  }

  private startDrag = () => {
    this.el.addClass('dragging')
    window.addEventListener('mousemove', this.drag)
    window.addEventListener('mouseup', this.endDrag)
  }
  private endDrag = () => {
    this.el.removeClass('dragging')
    window.removeEventListener('mousemove', this.drag)
    window.removeEventListener('mouseup', this.endDrag)
  }
  private drag = (e: MouseEvent) => {
    this.el.translate(e.movementX, e.movementY)
    this.x += e.movementX
    this.y += e.movementY
  }
}
