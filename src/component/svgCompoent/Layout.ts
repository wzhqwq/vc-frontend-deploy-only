import { G, Rect } from '@svgdotjs/svg.js'
import { LINE_WIDTH } from './Connector'
import { Layer } from './Layer'

const ITEM_GAP = 10

export class Layout {
  private rows: LayoutRow[] = []
  private container: G

  public animated: boolean = false

  constructor(layers: Layer[]) {
    this.container = new G()
    let maxRow = layers.reduce((max, l) => Math.max(max, l.row), 0)
    this.rows = new Array(maxRow + 1)
      .fill(null)
      .map((_, i) => new LayoutRow(layers.filter((l) => l.row == i)))
  }

  removeLayer(layer: Layer) {}

  attachLayer(layer: Layer, row: number) {}

  private updateLayout(startRow: number) {
    let rowsToUpdate = this.rows.slice(startRow)
    rowsToUpdate.reduce((y, r) => r.layout(y) + ITEM_GAP, 100)
  }
}

export class LayoutRow {
  private items: LayoutItem[] = []
  private row: Rect
  public x: number = 0
  public y: number = 0

  constructor(layers: Layer[]) {
    this.row = new Rect().radius(5)
    this.items = layers.map((l) => new LayoutLayer(this, l))
  }

  layout(y: number) {
    this.y = y

    let width = this.items.reduce((a, b) => a + b.width, 0) + (this.items.length - 1) * ITEM_GAP
    let height = this.items.reduce((a, b) => Math.max(a, b.height), 0)
    this.items.reduce((offset, i) => {
      i.updateX(offset)
      return offset + i.width + ITEM_GAP
    }, -width / 2)

    this.row.size(width, height).move(this.x, this.y)
    return y + height
  }

  attachItem(item: LayoutItem) {
    this.items.push(item)
  }
  removeItem(item: LayoutItem) {
    let index = this.items.indexOf(item)
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
}

export class LayoutItem {
  public x: number = 0

  constructor(public readonly row: LayoutRow, public width: number, public height = 0) {}

  updateX(x: number) {
    this.x = x
  }
}

interface LayoutEndPoint {
  offset: number
  line: LayoutLine
}

export class LayoutLayer extends LayoutItem {
  public inputs: LayoutEndPoint[]
  private outputs: LayoutEndPoint[]

  constructor(row: LayoutRow, public readonly layer: Layer) {
    super(row, layer.layer.bbox().width)
    this.inputs = layer.connectors
      .filter((c) => c.type == 'input')
      .map((c) => {
        let [end, vertex] = c.points
        return {
          offset: vertex[0],
          line: new LayoutLine(row, end),
        }
      })
    this.outputs = layer.connectors
      .filter((c) => c.type == 'output')
      .map((c) => {
        let [vertex, end] = c.points
        return {
          offset: vertex[0],
          line: new LayoutLine(row, end),
        }
      })
  }
  updateX(x: number) {
    this.outputs.forEach((o) => o.line.updateX(x + o.offset))
    this.layer.move(this.row.x + x, this.row.y)
    this.x = x
  }
}

export class LayoutLine extends LayoutItem {
  public previousLine: LayoutLine | null = null
  public nextLine: LayoutLine | null = null

  constructor(row: LayoutRow, public endOffset: [number, number] | null = null) {
    super(row, LINE_WIDTH)
  }
}
