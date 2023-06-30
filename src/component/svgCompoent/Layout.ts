import { G, Rect } from '@svgdotjs/svg.js'
import { Connector, LINE_WIDTH } from './Connector'
import { Layer } from './Layer'
import { joyTheme } from '@/theme'
import { ConnectionPath } from './ConnectionPath'
import { nanoid } from 'nanoid'

const ITEM_GAP = 10
const ROW_PAD = 10
const ROW_RADIUS = 20

const DROP_ZONE_COLOR = joyTheme.vars.palette.primary[100]

export class Layout {
  public readonly el: G

  private rows: LayoutRow[] = []
  private x: number = 0
  private dirtyPaths = new Set<string>()

  public animated: boolean = false

  constructor(layers: Layer[]) {
    this.el = new G()
    let maxRow = layers.reduce((max, l) => Math.max(max, l.row), 0)
    this.rows = new Array(maxRow + 1).fill(null).map(
      (_, i) =>
        new LayoutRow(
          this,
          layers.filter((l) => l.row == i),
        ),
    )
    this.rows.reduce((ends, row, i) => {
      // 从所有连出线的连接器获得端点布局
      let endsToLink = (row.items as LayoutLayer[])
        .map((layer) => layer.outputs.filter(({ targetRow }) => targetRow > i))
        .flat()
      endsToLink.forEach((l) => {
        l.path = new ConnectionPath(l)
        this.dirtyPaths.add(l.path.id)
        this.el.add(l.path.el)
      })
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
          line.linkDown(targetInput)
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
    row.detachLayer(layer)

    let lowestUnaffectedRow = layer.row
    // TODO: remove lines
    this.updateLayout(lowestUnaffectedRow)
  }

  attachLayer(layer: Layer, row: number) {
    if (row > this.rows.length) return
    if (row == this.rows.length) {
      this.rows.push(new LayoutRow(this))
    }
    this.rows[row].attachLayer(layer)

    let lowestUnaffectedRow = row
    // TODO: add lines
    this.updateLayout(lowestUnaffectedRow)
  }

  private updateLayout(startRow: number) {
    let rowsToUpdate = this.rows.slice(startRow)
    rowsToUpdate.reduce((y, r) => r.layout(y) + ITEM_GAP, 0)
    // TODO: optimize the connections
    this.dirtyPaths.forEach((id) => ConnectionPath.paths.get(id)?.render())
  }
}

export class LayoutRow {
  public readonly items: LayoutItem[]
  public readonly el: G
  private dropZone: Rect

  public offsetY: number = 0

  constructor(layout: Layout, layers: Layer[] = []) {
    this.el = new G().addClass('layout-row')
    this.dropZone = this.el.rect().radius(ROW_RADIUS).fill(DROP_ZONE_COLOR).addClass('drop-zone')
    this.items = layers.map((l) => new LayoutLayer(this, l))
    layers.forEach((l) => {
      l.layout = layout
    })
    layout.el.add(this.el)
  }

  layout(y: number) {
    this.offsetY = y + ROW_PAD

    let width = this.items.reduce((a, b) => a + b.width, 0) + (this.items.length - 1) * ITEM_GAP
    let height = this.items.reduce((a, b) => Math.max(a, b.height), 0)
    this.items.reduce((offset, i) => {
      i.updateX(offset)
      return offset + i.width + ITEM_GAP
    }, -width / 2)

    this.el.transform({ relativeY: y })
    this.dropZone.size(width + ROW_PAD * 2, height + ROW_PAD * 2).x(-width / 2 - ROW_PAD)
    return y + height + ROW_PAD * 2
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
  detachLayer(layer: Layer) {
    let index = this.items.findIndex((i) => i instanceof LayoutLayer && i.layer == layer)
    if (index >= 0) {
      ;(this.items[index] as LayoutLayer).dispose()
      this.items.splice(index, 1)
    }
  }
}

export class LayoutItem {
  protected x: number = 0

  constructor(public readonly row: LayoutRow, public width: number, public height = 0) {}

  updateX(x: number) {
    this.x = x
  }
}

export class LayoutLayer extends LayoutItem {
  public inputs: LayoutEndPoint[]
  public outputs: LayoutEndPoint[]

  constructor(row: LayoutRow, public readonly layer: Layer) {
    super(row, layer.width, layer.height)
    row.el.add(layer.el)
    let endPoints = layer.connectors.map((c) => new LayoutEndPoint(row, c))
    this.inputs = endPoints.filter(({ c }) => c.type == 'input')
    this.outputs = endPoints.filter(({ c }) => c.type == 'output')
  }
  updateX(x: number) {
    this.outputs.forEach((o) => o.updateX(x))
    this.layer.move(x, ROW_PAD)
    this.x = x
  }
  dispose() {
    this.layer.move(0, 0)
    this.layer.el.remove()
  }
}

export class LayoutLine extends LayoutItem {
  // public previousLine: LayoutLine | null = null
  public nextLine: LayoutLine | null = null
  public path: ConnectionPath | null = null
  public id = nanoid()

  constructor(row: LayoutRow) {
    super(row, LINE_WIDTH)
  }

  linkDown(line: LayoutLine) {
    this.nextLine = line
    // line.previousLine = this
    line.path = this.path
  }
  get points(): [number, number][] {
    return [
      [this.x, this.row.offsetY],
      [this.x, this.row.offsetY + this.height],
    ]
  }
}

export class LayoutEndPoint extends LayoutLine {
  private offsetX: number = 0
  public targetRow: number
  public farthestLine: LayoutLine | null = null
  public end: [number, number]

  constructor(row: LayoutRow, public c: Connector) {
    let [end, vertex] = c.points
    super(row)
    this.offsetX = vertex[0]
    this.end = end
    this.targetRow = c.peer?.layer.row ?? -1
  }

  linkDown(line: LayoutLine) {
    if (!this.nextLine) {
      super.linkDown(line)
    }
    this.farthestLine?.linkDown(line)
    this.farthestLine = line
  }
  get points(): [number, number][] {
    console.log(this.id, this.offsetX, this.end)
    let basicPoints = [
      [this.x + this.offsetX, this.row.offsetY],
      [this.x + this.offsetX, this.row.offsetY + this.height],
    ] as [number, number][]
    let endPoint = [this.x + this.end[0], this.row.offsetY + this.end[1]] as [number, number]

    return this.c.type == 'input' ? [...basicPoints, endPoint] : [endPoint, ...basicPoints]
  }
}
