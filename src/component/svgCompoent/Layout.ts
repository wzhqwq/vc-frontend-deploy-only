import { G, Rect } from '@svgdotjs/svg.js'
import { Connector, LINE_WIDTH } from './Connector'
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
    this.rows.reduce((ends, row, i) => {
      // 为所有连出线的连接器创建端点布局
      let endsToLink = (row.items as LayoutLayer[])
        .map((layer) => layer.outputs.filter(({ targetRow }) => targetRow > i))
        .flat()
      // 从未连接的连线中寻找连接到本行的层的连线，与对应连接器的连线布局进行连接
      ends
        .filter(({ targetRow }) => targetRow == i)
        .forEach((line) => {
          const target = line.c.peer
          if (!target) return
          const targetLayer = row.items.find((l) => l instanceof LayoutLayer && l.layer.has(target))
          if (!targetLayer) return
          const targetInput = (targetLayer as LayoutLayer).inputs.find((i) => i.c == target)
          if (!targetInput) return
          line.linkDown(line)
        })
      // 为剩下未连接的连线创建中间连线布局，并进行连接
      let linesToHold = ends.filter(({ targetRow }) => targetRow != i)
      linesToHold.forEach((l) => {
        let newLine = new LayoutLine(row)
        l.linkDown(newLine)
        row.attachItem(newLine)
      })
      return [...linesToHold, ...endsToLink]
    }, [] as LayoutEndPoint[])
    this.updateLayout(0)
  }

  removeLayer(layer: Layer) {
    let row = this.rows[layer.row]
    if (!row) return
    row.removeLayer(layer)

    let lowestUnaffectedRow = layer.row
    // TODO: remove lines
    this.updateLayout(lowestUnaffectedRow)
  }

  attachLayer(layer: Layer, row: number) {
    if (row > this.rows.length) return
    if (row == this.rows.length) {
      this.rows.push(new LayoutRow())
    }
    this.rows[row].attachLayer(layer)

    let lowestUnaffectedRow = row
    // TODO: add lines
    this.updateLayout(lowestUnaffectedRow)
  }

  private updateLayout(startRow: number) {
    let rowsToUpdate = this.rows.slice(startRow)
    rowsToUpdate.reduce((y, r) => r.layout(y) + ITEM_GAP, 100)
    // TODO: optimize the connections
  }
}

export class LayoutRow {
  public items: LayoutItem[]
  private row: Rect
  public x: number = 0
  public y: number = 0

  constructor(layers: Layer[] = []) {
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
  attachItems(items: LayoutItem[]) {
    this.items.push(...items)
  }
  attachLayer(layer: Layer) {
    this.items.push(new LayoutLayer(this, layer))
  }
  removeItem(item: LayoutItem) {
    let index = this.items.indexOf(item)
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }
  removeLayer(layer: Layer) {
    let index = this.items.findIndex((i) => i instanceof LayoutLayer && i.layer == layer)
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

export class LayoutLayer extends LayoutItem {
  public inputs: LayoutEndPoint[]
  public outputs: LayoutEndPoint[]

  constructor(row: LayoutRow, public readonly layer: Layer) {
    super(row, layer.layer.bbox().width)
    let endPoints = layer.connectors.map((c) => new LayoutEndPoint(row, c))
    this.inputs = endPoints.filter(({ c }) => c.type == 'input')
    this.outputs = endPoints.filter(({ c }) => c.type == 'output')
  }
  updateX(x: number) {
    this.outputs.forEach((o) => o.updateX(x + o.offset))
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

  linkDown(line: LayoutLine) {
    this.nextLine = line
    line.previousLine = this
  }
}

export class LayoutEndPoint extends LayoutLine {
  public offset: number
  public targetRow: number
  public farthestLine: LayoutLine

  constructor(row: LayoutRow, public c: Connector) {
    let [end, vertex] = c.points
    super(row, end)
    this.offset = vertex[0]
    this.targetRow = c.peer?.layer.row ?? -1
    this.farthestLine = this
  }

  linkDown(line: LayoutLine) {
    this.farthestLine.linkDown(line)
    this.farthestLine = line
  }
}
