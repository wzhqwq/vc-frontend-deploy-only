import { Container, G, Rect, Shape, Text } from '@svgdotjs/svg.js'
import { DynamicShape, LayerConfig } from '@/types/config/deepLearning'
import { Connector } from './Connector'
import { renderConnectorLabel } from '@/config/connector'
import { LayerParameters } from '@/types/config/parameter'

const MIN_HEIGHT = 80
const MIN_WIDTH = 140
const CONNECTOR_GAP_X = 100
const CONNECTOR_GAP_Y = 40

export class Layer<P extends LayerParameters = LayerParameters> {
  public readonly layer: G
  private boundary: Rect
  private shape: Shape | null = null
  private text: Text

  private connectors: Connector[]

  private inputShapes: DynamicShape[] = []
  private parameters: P

  constructor(parent: Container, private config: LayerConfig<P>, parameters?: P) {
    this.layer = parent.group().addClass('layer')
    this.parameters = parameters ?? config.defaultParameters
    this.inputShapes = config.inputs.map((c) => ({
      shapeValue: new Array(c.shape.placeholders.length).fill({
        value: 0,
        virtual: false,
        available: false,
      }),
      connected: false,
    }))

    this.connectors = [...config.inputs, ...config.outputs].map((c) =>
      new Connector(this.layer, c.side, c.type, c.shape.placeholders.length).label(
        renderConnectorLabel(c.shape, this.inputShapes, this.parameters),
      ),
    )

    this.boundary = this.layer.rect().fill('transparent')
    this.doConnectorLayout()

    this.text = this.layer
      .text(this.config.displayName ?? this.config.name)
      .font({ size: 18 })
      .fill('#FFF')
    this.text.center(0, 0)
    this.boundary.center(0, 0)

    this.renderShape()

    this.startDrag = this.startDrag.bind(this)
    this.drag = this.drag.bind(this)
    this.endDrag = this.endDrag.bind(this)

    this.layer.on('mousedown', this.startDrag)
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
    this.layer.add(this.shape)
    this.text.front()
  }

  private startDrag = () => {
    this.layer.addClass('dragging')
    window.addEventListener('mousemove', this.drag)
    window.addEventListener('mouseup', this.endDrag)
  }
  private endDrag = () => {
    this.layer.removeClass('dragging')
    window.removeEventListener('mousemove', this.drag)
    window.removeEventListener('mouseup', this.endDrag)
  }
  private drag = (e: MouseEvent) => {
    this.layer.translate(e.movementX, e.movementY)
  }
}
