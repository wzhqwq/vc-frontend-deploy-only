import { G, Rect } from '@svgdotjs/svg.js'
import { Connector, ConnectorPoints, LINE_WIDTH } from './Connector'
import { Layer } from './Layer'
import { joyTheme } from '@/theme'
import { ConnectionPath } from './ConnectionPath'

const ITEM_GAP = 10
const ROW_PAD = 10
const ROW_RADIUS = 20

const DROP_ZONE_COLOR = joyTheme.vars.palette.primary[500]

export class Layout {
  public readonly el: G

  public readonly rows: LayoutRow[] = []
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
        l.path.el.back()
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

  attachLayer(layer: Layer, row: number, insert: boolean) {
    if (row > this.rows.length) return
    if (row == this.rows.length) {
      this.rows.push(new LayoutRow(this))
    }
    if (insert) {
      this.rows.splice(row, 0, new LayoutRow(this))
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

const getRowDragEnterHandler = (self: Rect, className: string) => (e: Event) => {
  if (
    (e as DragEvent).dataTransfer?.types.includes('layer') &&
    (e.target as SVGElement).classList.contains(className)
  )
    self.front().addClass('drag-over')
}
const getRowDragLeaveHandler = (self: Rect, className: string) => (e: Event) => {
  if (
    (e as DragEvent).dataTransfer?.types.includes('layer') &&
    (e.target as SVGElement).classList.contains(className)
  )
    self.back().removeClass('drag-over')
}
const rowDragOverHandler = (e: Event) => {
  if ((e as DragEvent).dataTransfer?.types.includes('layer')) e.preventDefault()
}
const getRowDropHandler =
  (self: Rect, layout: Layout, row: LayoutRow, insert: boolean) => (e: Event) => {
    if (!(e as DragEvent).dataTransfer?.types.includes('layer')) return
    self.back().removeClass('drag-over')
    let rowIndex = layout.rows.indexOf(row)
    let layerId = (e as DragEvent).dataTransfer?.getData('layer')
    if (!layerId) return
    let layer = Layer.layers.get(layerId)
    if (!layer) return
    if (layer.row == rowIndex) return
    layout.removeLayer(layer)
    layout.attachLayer(layer, rowIndex, insert)
  }
export class LayoutRow {
  public readonly items: LayoutItem[]
  public readonly el: G
  private dropZone: Rect
  private insertLine: Rect
  private lines: LayoutLine[]

  constructor(layout: Layout, layers: Layer[] = []) {
    this.el = new G().addClass('layout-row')
    this.dropZone = this.el
      .rect()
      .radius(ROW_RADIUS)
      .stroke({ color: DROP_ZONE_COLOR, width: 2, dasharray: '5,5' })
      .fill('transparent')
      .addClass('drop-zone')
    this.insertLine = this.el
      .rect()
      .radius(ITEM_GAP / 6)
      .fill(DROP_ZONE_COLOR)
      .stroke({ color: 'transparent', width: ITEM_GAP / 3 })
      .addClass('insert-line')

    this.items = layers.map((l) => new LayoutLayer(this, l))
    this.lines = this.items.flatMap((i) => i.lines)
    layers.forEach((l) => {
      l.layout = layout
    })
    layout.el.add(this.el)

    this.dropZone.on('dragenter', getRowDragEnterHandler(this.dropZone, 'drop-zone'))
    this.dropZone.on('dragleave', getRowDragLeaveHandler(this.dropZone, 'drop-zone'))
    this.dropZone.on('dragover', rowDragOverHandler)
    this.dropZone.on('drop', getRowDropHandler(this.dropZone, layout, this, false))
    this.insertLine.on('dragenter', getRowDragEnterHandler(this.insertLine, 'insert-line'))
    this.insertLine.on('dragleave', getRowDragLeaveHandler(this.insertLine, 'insert-line'))
    this.insertLine.on('dragover', rowDragOverHandler)
    this.insertLine.on('drop', getRowDropHandler(this.insertLine, layout, this, true))
  }

  layout(y: number) {
    let width = Math.max(
      100,
      this.items.reduce((a, b) => a + b.width, 0) + (this.items.length - 1) * ITEM_GAP,
    )
    let height = Math.max(
      100,
      this.items.reduce((a, b) => Math.max(a, b.height), 0),
    )
    this.items.reduce((offset, i) => {
      i.update(offset, y + ROW_PAD)
      return offset + i.width + ITEM_GAP
    }, -width / 2)
    this.lines.forEach((l) => (l.horizontalY = y + height + ITEM_GAP))

    this.dropZone.size(width + ROW_PAD * 2, height + ROW_PAD * 2).move(-width / 2 - ROW_PAD, y)
    this.insertLine
      .size(width + ROW_PAD * 2, ITEM_GAP / 3)
      .move(-width / 2 - ROW_PAD, y + height + ROW_PAD * 2 + ITEM_GAP / 3)
    return y + height + ROW_PAD * 2
  }

  attachItem(item: LayoutItem) {
    this.items.push(item)
    this.lines.push(...item.lines)
  }
  attachItems(items: LayoutItem[]) {
    this.items.push(...items)
    this.lines.push(...items.flatMap((i) => i.lines))
  }
  attachLayer(layer: Layer) {
    this.attachItem(new LayoutLayer(this, layer))
  }
  removeLine(item: LayoutLine) {
    let itemIndex = this.items.indexOf(item)
    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
    let lineIndex = this.lines.indexOf(item)
    if (lineIndex >= 0) {
      this.lines.splice(lineIndex, 1)
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
  protected _x: number = 0
  protected _y: number = 0

  constructor(public readonly row: LayoutRow, public width: number, public height = 0) {}

  update(x: number, y: number) {
    this._x = x
    this._y = y
  }
  get x() {
    return this._x
  }
  get lines() {
    return [] as LayoutLine[]
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
  update(x: number, y: number) {
    super.update(x, y)
    this.layer.move(x, y)
    this.inputs.forEach((o) => o.update(this.layer.x, this.layer.y))
    this.outputs.forEach((o) => o.update(this.layer.x, this.layer.y))
  }
  dispose() {
    this.layer.move(0, 0)
    this.layer.el.remove()
  }
  get lines() {
    return this.outputs
  }
}

export class LayoutLine extends LayoutItem {
  // public previousLine: LayoutLine | null = null
  public nextLine: LayoutLine | null = null
  public path: ConnectionPath | null = null
  // public id = nanoid()
  public horizontalY: number = 0

  constructor(row: LayoutRow) {
    super(row, LINE_WIDTH)
  }

  linkDown(line: LayoutLine) {
    this.nextLine = line
    // line.previousLine = this
    line.path = this.path
  }
  get points(): [number, number][] {
    if (this.nextLine) {
      return [
        [this._x, this.horizontalY],
        [this.nextLine.x, this.horizontalY],
      ]
    } else {
      return [[this._x, this.horizontalY]]
    }
  }
  get lines() {
    return [this]
  }
}

export class LayoutEndPoint extends LayoutLine {
  public targetRow: number
  public farthestLine: LayoutLine | null = null

  constructor(row: LayoutRow, public c: Connector) {
    super(row)
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
    let connectorPoints = this.c.points.map<[number, number]>(([x, y]) => [
      this._x + x,
      this._y + y,
    ])
    if (this.nextLine) {
      // is output
      return [
        ...connectorPoints,
        [connectorPoints[1][0], this.horizontalY],
        [this.nextLine.x, this.horizontalY],
      ]
    } else {
      // is input
      return connectorPoints.reverse()
    }
  }
  get x() {
    return this._x + this.c.points[1][0]
  }
}
