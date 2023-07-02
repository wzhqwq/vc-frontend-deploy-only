import { G, Rect } from '@svgdotjs/svg.js'
import { Connector, ConnectorPoints, LINE_WIDTH } from './Connector'
import { Layer } from './Layer'
import { joyTheme } from '@/theme'
import { ConnectionPath } from './ConnectionPath'

const ITEM_GAP = 10
const ROW_PAD = 10
const ROW_RADIUS = 20
const INSERT_LINE_WIDTH = 3

const DROP_ZONE_COLOR = joyTheme.vars.palette.primary[500]
const INSERT_LINE_COLOR = joyTheme.vars.palette.primary[600]

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
          i,
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

  public removeLayer(layer: Layer) {
    const row = this.rows.at(layer.row)
    if (!row) return
    const layout = row.detachLayer(layer)
    if (!layout) return
    if (row.items.length == 0) {
      this.rows.splice(layer.row, 1)
      this.rows.slice(layer.row).forEach((r) => r.index--)
    }

    layout.dispose()
    this.updateLayout(layout.upperRow)
  }

  public attachLayer(layer: Layer, row: number, insert: boolean) {
    if (row > this.rows.length) return
    if (row == this.rows.length) {
      this.rows.push(new LayoutRow(row, this))
    }
    if (insert) {
      this.rows.splice(row, 0, new LayoutRow(row, this))
      this.rows.slice(row + 1).forEach((r) => r.index++)
    }
    layer.row = row
    let layout = this.rows[row].attachLayer(layer)

    // TODO: add lines
    this.updateLayout(layout.upperRow)
  }

  public moveLayer(layer: Layer, row: number, insert: boolean) {
    if (row > this.rows.length) return
    if (!insert && row == layer.row) return
    if (row == this.rows.length) {
      this.rows.push(new LayoutRow(row, this))
    }
    const oldRow = this.rows.at(layer.row)
    if (!oldRow) return
    const layout = oldRow.detachLayer(layer)
    if (!layout) return
    if (oldRow.items.length == 0) {
      this.rows.splice(layer.row, 1)
      this.rows.slice(layer.row).forEach((r) => r.index--)
      if (layer.row < row) row--
    }
    if (insert) {
      this.rows.splice(row, 0, new LayoutRow(row, this))
      this.rows.slice(row + 1).forEach((r) => r.index++)
    }

    layer.row = row
    layout.row = this.rows[row]
    this.rows[row].attachItem(layout)
    layout.resume().forEach((p) => {
      this.dirtyPaths.add(p.id)
      this.el.add(p.el)
      p.el.back()
    })

    this.updateLayout(layout.upperRow)
  }

  private updateLayout(startRow: number) {
    let rowsToUpdate = this.rows.slice(startRow)
    rowsToUpdate.reduce((y, r) => r.doLayout(y) + ITEM_GAP, ITEM_GAP)
    // TODO: optimize the connections
    this.dirtyPaths.forEach((id) => ConnectionPath.paths.get(id)?.render())
    this.dirtyPaths.clear()
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
const getRowDropHandler = (self: Rect, row: LayoutRow, insert: boolean) => (e: Event) => {
  if (!(e as DragEvent).dataTransfer?.types.includes('layer')) return
  self.back().removeClass('drag-over')
  let rowIndex = row.layout.rows.indexOf(row)
  let layerId = (e as DragEvent).dataTransfer?.getData('layer')
  if (!layerId) return
  let layer = Layer.layers.get(layerId)
  if (!layer) return
  row.layout.moveLayer(layer, rowIndex, insert)
  layer.el.removeClass('dragging')
}
export class LayoutRow {
  public readonly items: LayoutItem[]
  public readonly el: G
  private dropZone: Rect
  private insertLine: Rect

  constructor(public _index: number, public layout: Layout, layers: Layer[] = []) {
    this.el = new G().addClass('layout-row')
    this.dropZone = this.el
      .rect()
      .radius(ROW_RADIUS)
      .stroke({ color: DROP_ZONE_COLOR, width: 2, dasharray: '5,5' })
      .fill('transparent')
      .addClass('drop-zone')
    this.insertLine = this.el
      .rect()
      .radius(INSERT_LINE_WIDTH / 2)
      .fill(INSERT_LINE_COLOR)
      .stroke({ color: 'transparent', width: INSERT_LINE_WIDTH * 2 })
      .addClass('insert-line')

    this.items = layers.map((l) => new LayoutLayer(this, l))
    layers.forEach((l) => {
      l.layout = layout
    })
    layout.el.add(this.el)

    this.dropZone.on('dragenter', getRowDragEnterHandler(this.dropZone, 'drop-zone'))
    this.dropZone.on('dragleave', getRowDragLeaveHandler(this.dropZone, 'drop-zone'))
    this.dropZone.on('dragover', rowDragOverHandler)
    this.dropZone.on('drop', getRowDropHandler(this.dropZone, this, false))
    this.insertLine.on('dragenter', getRowDragEnterHandler(this.insertLine, 'insert-line'))
    this.insertLine.on('dragleave', getRowDragLeaveHandler(this.insertLine, 'insert-line'))
    this.insertLine.on('dragover', rowDragOverHandler)
    this.insertLine.on('drop', getRowDropHandler(this.insertLine, this, true))
  }

  public doLayout(y: number) {
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
    this.items.flatMap((i) => i.lines).forEach((l) => (l.horizontalY = y + height + ITEM_GAP))

    this.dropZone.size(width + ROW_PAD * 2, height + ROW_PAD * 2).move(-width / 2 - ROW_PAD, y)
    this.insertLine
      .size(width + ROW_PAD * 2, INSERT_LINE_WIDTH)
      .move(-width / 2 - ROW_PAD, y - (ITEM_GAP + INSERT_LINE_WIDTH) / 2)
    return y + height + ROW_PAD * 2
  }

  public attachItem(item: LayoutItem) {
    this.items.push(item)
  }
  public attachItems(items: LayoutItem[]) {
    this.items.push(...items)
  }
  public attachLayer(layer: Layer) {
    let layout = new LayoutLayer(this, layer)
    this.attachItem(layout)
    return layout
  }
  public removeLine(item: LayoutLine) {
    let itemIndex = this.items.indexOf(item)
    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
  public detachLayer(layer: Layer) {
    let index = this.items.findIndex((i) => i instanceof LayoutLayer && i.layer == layer)
    if (index >= 0) {
      let layout = this.items.splice(index, 1)[0] as LayoutLayer
      return layout.reset()
    }
  }
  public set index(index: number) {
    this.items
      .filter((i): i is LayoutLayer => i instanceof LayoutLayer)
      .forEach((i) => (i.layer.row = index))
    this._index = index
  }
  public get index() {
    return this._index
  }
}

export class LayoutItem {
  protected _x: number = 0
  protected _y: number = 0

  constructor(public row: LayoutRow, public width: number, public height = 0) {}

  public update(x: number, y: number) {
    this._x = x
    this._y = y
  }
  public get x() {
    return this._x
  }
  public get lines() {
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
  public update(x: number, y: number) {
    super.update(x, y)
    this.layer.move(x, y)
    this.inputs.forEach((o) => o.update(this.layer.x, this.layer.y))
    this.outputs.forEach((o) => o.update(this.layer.x, this.layer.y))
    return this
  }
  public reset() {
    this.layer.move(0, 0)
    this.layer.el.remove()
    this.inputs.forEach((o) => o.detach())
    this.outputs.forEach((o) => o.detach())
    return this
  }
  public resume() {
    this.row.el.add(this.layer.el)
    this.inputs.forEach((i) => i.resumePath())
    this.outputs.forEach((o) => o.resumePath())
    return [...this.inputs.map((i) => i.path), ...this.outputs.map((o) => o.path)].filter(
      (p) => p != null,
    ) as ConnectionPath[]
  }
  public dispose() {
    this.inputs.forEach((i) => i.disconnect())
    this.outputs.forEach((o) => o.disconnect())
  }
  public get upperRow() {
    return this.inputs.reduce((row, i) => Math.min(row, i.c.peer?.layer.row ?? row), this.row.index)
  }
  public get lines() {
    return this.outputs
  }
}

export class LayoutLine extends LayoutItem {
  public nextLine: LayoutLine | null = null
  public path: ConnectionPath | null = null
  // public id = nanoid()
  public horizontalY: number = 0

  constructor(row: LayoutRow) {
    super(row, LINE_WIDTH)
  }

  public linkDown(line: LayoutLine) {
    this.nextLine = line
    line.path = this.path
  }
  public get points(): [number, number][] {
    if (this.nextLine) {
      return [
        [this._x, this.horizontalY],
        [this.nextLine.x, this.horizontalY],
      ]
    } else {
      return [[this._x, this.horizontalY]]
    }
  }
  public get lines() {
    return [this]
  }
}

export class LayoutEndPoint extends LayoutLine {
  public targetRow: number
  public farthestLine: LayoutLine | null = null
  public anotherEnd: LayoutEndPoint | null = null

  constructor(row: LayoutRow, public c: Connector) {
    super(row)
    this.targetRow = c.peer?.layer.row ?? -1
  }

  public linkDown(line: LayoutLine) {
    if (!this.nextLine) {
      super.linkDown(line)
    }
    this.farthestLine?.linkDown(line)
    this.farthestLine = line
    if (line instanceof LayoutEndPoint) {
      this.anotherEnd = line
      line.anotherEnd = this
    }
  }
  public get points(): [number, number][] {
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
  public get x() {
    return this._x + this.c.points[1][0]
  }
  public detach() {
    if (!this.farthestLine) {
      this.anotherEnd?.detach()
      this.path = null
      return
    }
    let currentLine: LayoutLine | null = this
    while (currentLine) {
      currentLine.row.removeLine(currentLine)
      currentLine = currentLine.nextLine
    }
    this.path?.dispose()
    this.path = this.farthestLine = this.nextLine = null
  }
  public resumePath() {
    if (this.c.type == 'input') {
      this.anotherEnd?.resumePath()
      return
    }
    if (!this.anotherEnd) return
    this.path = new ConnectionPath(this)
    for (let i = this.row.index + 1; i < this.anotherEnd.row.index; i++) {
      let row = this.row.layout.rows[i]
      let newLine = new LayoutLine(row)
      this.linkDown(newLine)
      row.attachItem(newLine)
    }
    this.linkDown(this.anotherEnd)
  }
  public disconnect() {
    this.detach()
    this.anotherEnd = null
  }
}
