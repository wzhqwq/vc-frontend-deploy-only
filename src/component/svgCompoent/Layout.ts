import { G, Rect } from '@svgdotjs/svg.js'
import { Connector, LINE_WIDTH } from './Connector'
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
  public width: number = 0
  private dirtyPaths = new Set<ConnectionPath>()

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
      endsToLink.forEach((l) => this.addPath((l.path = new ConnectionPath(l))))
      // 从未连接的连线中寻找连接到本行的层的连线，与对应连接器的连线布局进行连接
      ends
        .filter(({ targetRow }) => targetRow == i)
        .forEach((line) => {
          const targetInput = line.c.peer?.endPoint
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
    if (!row.items.some((i) => i instanceof LayoutLayer)) this.removeRow(row.index)

    layout.reset()
    this.updateLayout(Math.min(row.index, layout.upperRow + 1))
    layer.connectors.forEach((c) => c.disconnect())
  }

  public attachLayer(layer: Layer, row: number, insert: boolean) {
    if (row > this.rows.length) return
    if (row == this.rows.length) {
      this.rows.push(new LayoutRow(row, this))
    }
    if (insert) this.insertRow(row)

    layer.row = row
    let layout = this.rows[row].attachLayer(layer)
    this.updateLayout(Math.min(row, layout.upperRow + 1))
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
    if (!oldRow.items.some((i) => i instanceof LayoutLayer)) {
      this.removeRow(oldRow.index)
      if (layer.row < row) row--
    }
    if (insert) this.insertRow(row)

    layer.row = row
    layout.updateRow(this.rows[row])
    this.rows[row].attachItem(layout)
    layout.resume()

    this.updateLayout(Math.min(row, oldRow.index, layout.upperRow + 1))
  }

  public updateLayout(startRow: number) {
    // 完成startRow及之后的连线优化
    this.rows.slice(startRow).forEach((r) => r.optimize().doLayoutX())
    this.width = this.rows.reduce((max, r) => Math.max(max, r.width), 0)
    // 连线优化可能会调整布局元素的位置，从而影响折线渲染，因此要从startRow-1开始重新布局
    startRow = Math.max(0, startRow - 1)
    this.rows
      .slice(startRow)
      .reduce(
        (y, r) => r.doLayoutY(y) + ITEM_GAP,
        (startRow ? this.rows[startRow - 1].endY : 0) + ITEM_GAP,
      )
    this.dirtyPaths.forEach(p => p.render())
    this.dirtyPaths.clear()
  }
  public addPath(path: ConnectionPath) {
    this.dirtyPaths.add(path)
    this.el.add(path.el)
    path.el.back()
  }
  public markDirty(path: ConnectionPath) {
    this.dirtyPaths.add(path)
  }
  private insertRow(row: number) {
    const newRow = new LayoutRow(row, this)
    this.rows.splice(row, 0, newRow)
    this.rows.slice(row + 1).forEach((r) => r.index++)
    if (!row) return
    newRow.attachItems(
      this.rows[row - 1].items
        .flatMap((i) => i.lines)
        .map((l) => {
          if (!l.nextLine) return null
          const newLine = new LayoutLine(newRow)
          l.insertLineNext(newLine)
          return newLine
        })
        .filter((l): l is LayoutLine => l != null),
    )
  }
  private removeRow(row: number) {
    const oldRow = this.rows.splice(row, 1)[0]
    oldRow.dispose()
    this.rows.slice(row).forEach((r) => r.index--)
  }
  public dispose() {
    this.el.remove()
    // ConnectionPath.paths.clear()
  }
}

const getRowDragEnterHandler = (self: Rect, className: string) => (e: Event) => {
  if (
    (e as DragEvent).dataTransfer?.types.includes('layer') &&
    (e.target as SVGElement).classList.contains(className)
  )
    self.addClass('drag-over')
}
const getRowDragLeaveHandler = (self: Rect, className: string) => (e: Event) => {
  if (
    (e as DragEvent).dataTransfer?.types.includes('layer') &&
    (e.target as SVGElement).classList.contains(className)
  )
    self.removeClass('drag-over')
}
const rowDragOverHandler = (e: Event) => {
  if ((e as DragEvent).dataTransfer?.types.includes('layer')) e.preventDefault()
}
const getRowDropHandler = (self: Rect, row: LayoutRow, insert: boolean) => (e: Event) => {
  if (!(e as DragEvent).dataTransfer?.types.includes('layer')) return
  self.removeClass('drag-over')
  let rowIndex = row.layout.rows.indexOf(row)
  let layerId = (e as DragEvent).dataTransfer?.getData('layer')
  if (!layerId) return
  let layer = Layer.layers.get(layerId)
  if (!layer) return
  row.layout.moveLayer(layer, rowIndex, insert)
}
export class LayoutRow {
  public readonly items: LayoutItem[]
  public readonly el: G
  private dropZone: Rect
  private insertLine: Rect
  public startY: number = -1
  public endY: number = 0
  public width: number = 0
  private itemsDirty: boolean = true
  private lines: LayoutLine[] = []

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
    layout.el.add(this.el)

    this.dropZone.on('dragenter', getRowDragEnterHandler(this.dropZone, 'drop-zone'))
    this.dropZone.on('dragleave', getRowDragLeaveHandler(this.dropZone, 'drop-zone'))
    this.dropZone.on('dragover', rowDragOverHandler)
    this.dropZone.on('drop', getRowDropHandler(this.dropZone, this, false))
    this.insertLine.on('dragenter', getRowDragEnterHandler(this.insertLine, 'insert-line'))
    this.insertLine.on('dragleave', getRowDragLeaveHandler(this.insertLine, 'insert-line'))
    this.insertLine.on('dragover', rowDragOverHandler)
    this.insertLine.on('drop', getRowDropHandler(this.insertLine, this, true))
    this.el.on('mousedown', (e) => {
      e.stopPropagation()
    })
  }

  public doLayoutX() {
    this.width = Math.max(
      100,
      this.items.reduce((a, b) => a + b.width, 0) + (this.items.length - 1) * ITEM_GAP,
    ) + ROW_PAD * 2

    this.items.reduce((offset, i) => {
      i.updateX(offset)
      return offset + i.width + ITEM_GAP
    }, -this.width / 2 + ROW_PAD)

    this.dropZone.width(this.width).x(-this.width / 2)

    return this
  }
  public doLayoutY(y: number) {
    let height = Math.max(
      100,
      this.items.reduce((a, b) => Math.max(a, b.height), 0),
    )

    if (this.startY != y || this.itemsDirty) {
      this.items.forEach((i) => i.updateY(y + ROW_PAD))
    }
    this.startY = y

    if (this.itemsDirty) this.lines = this.items.flatMap((i) => i.lines)
    // 使用扫描线算法，使所有的横线段不重叠
    const ranges = this.lines
      .filter((l) => l.nextLine != null)
      .flatMap((l) => [
        { x: Math.min(l.x, l.nextLine!.x), l, start: true },
        { x: Math.max(l.x, l.nextLine!.x), l, start: false },
      ])
    ranges.sort((a, b) => (a.x == b.x ? Number(a.start) - Number(b.start) : a.x - b.x))
    let maxLevel = 1
    ranges.reduce((level, { l, start }) => {
      maxLevel = Math.max(maxLevel, level)
      if (start) {
        l.horizontalY = y + height + ITEM_GAP * (level + 1)
        return level + 1
      }
      return level - 1
    }, 1)
    height += (maxLevel - 1) * ITEM_GAP + ROW_PAD * 2

    this.dropZone.height(height).y(y)
    this.insertLine
      .size(this.layout.width, INSERT_LINE_WIDTH)
      .move(-this.layout.width / 2, y - (ITEM_GAP + INSERT_LINE_WIDTH) / 2)

    this.itemsDirty = false

    return (this.endY = y + height)
  }

  public optimize() {
    this.items.sort((a, b) => a.peerOrder - b.peerOrder)
    this.items.forEach((i, index) => (i.order = index))
    this.itemsDirty = true
    return this
  }

  public attachItem(item: LayoutItem) {
    this.items.push(item)
    this.itemsDirty = true
  }
  public attachItems(items: LayoutItem[]) {
    this.items.push(...items)
    this.itemsDirty = true
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
      this.itemsDirty = true
    }
  }
  public detachLayer(layer: Layer) {
    let index = this.items.findIndex((i) => i instanceof LayoutLayer && i.layer == layer)
    if (index >= 0) {
      let layout = this.items.splice(index, 1)[0] as LayoutLayer
      this.itemsDirty = true
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
  public dispose() {
    this.el.remove()
    this.items
      .filter((i): i is LayoutLine => i instanceof LayoutLine)
      .forEach((l) => l.removeSelf())
  }
}

export class LayoutItem {
  protected _x: number = NaN
  protected _y: number = NaN
  protected _order: number = 0

  constructor(public row: LayoutRow, public width: number, public height = 0) {}

  public updateX(x: number) {
    this._x = x
  }
  public updateY(y: number) {
    this._y = y
  }
  public get x() {
    return this._x
  }
  public get lines() {
    return [] as LayoutLine[]
  }
  public get order() {
    return this._order
  }
  public set order(order: number) {
    this._order = order
  }
  public get peerOrder() {
    return this._order
  }
}

export class LayoutLayer extends LayoutItem {
  public inputs: LayoutEndPoint[]
  public outputs: LayoutEndPoint[]

  constructor(row: LayoutRow, public readonly layer: Layer) {
    super(row, layer.width, layer.height)
    row.el.add(layer.el)
    layer.layout = this
    let endPoints = layer.connectors.map((c) => new LayoutEndPoint(row, c))
    this.inputs = endPoints.filter(({ c }) => c.type == 'input')
    this.outputs = endPoints.filter(({ c }) => c.type == 'output')
  }
  public updateX(x: number) {
    if (this._x == x) return
    super.updateX(x)
    this.layer.move(this._x, this._y)
    this.inputs.forEach((i) => i.updateX(this.layer.x))
    this.outputs.forEach((o) => o.updateX(this.layer.x))
    return this
  }
  public updateY(y: number) {
    if (this._y == y) return
    super.updateY(y)
    this.layer.move(this._x, this._y)
    this.inputs.forEach((i) => i.updateY(this.layer.y))
    this.outputs.forEach((o) => o.updateY(this.layer.y))
    return this
  }
  public reset() {
    this.layer.move(0, 0)
    this.layer.el.remove()
    this.inputs.forEach((i) => i.detach())
    this.outputs.forEach((o) => o.detach())
    return this
  }
  public resume() {
    this.row.el.add(this.layer.el)
    this.inputs.forEach((i) => i.resumePath())
    this.outputs.forEach((o) => o.resumePath())
    return this
  }
  public get upperRow() {
    return this.inputs.reduce((row, i) => Math.min(row, i.c.peer?.layer.row ?? row), this.row.index)
  }
  public get lines() {
    return this.outputs
  }
  public updateRow(row: LayoutRow) {
    this.row = row
    this.inputs.forEach((i) => (i.row = row))
    this.outputs.forEach((o) => (o.row = row))
    return this
  }
  public get peerOrder() {
    let orders = this.inputs.filter((i) => i.prevLine).map((i) => i.prevLine!.order)
    return orders.sort((a, b) => a - b)[Math.floor(orders.length / 2)] ?? 0
  }
}

export class LayoutLine extends LayoutItem {
  public prevLine: LayoutLine | null = null
  public nextLine: LayoutLine | null = null
  public path: ConnectionPath | null = null
  public horizontalY: number = 0

  constructor(row: LayoutRow) {
    super(row, LINE_WIDTH)
  }

  public linkDown(line: LayoutLine) {
    line.prevLine = this
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
  public updateX(x: number) {
    if (this._x == x) return
    super.updateX(x)
    if (!this.path) return
    this.row.layout.markDirty(this.path)
  }
  public updateY(y: number) {
    if (this._y == y) return
    super.updateY(y)
    if (!this.path) return
    this.row.layout.markDirty(this.path)
  }
  public insertLineNext(line: LayoutLine) {
    line.path = this.path
    if (this.nextLine) this.nextLine.prevLine = line
    line.nextLine = this.nextLine
    line.prevLine = this
    this.nextLine = line
  }
  public removeSelf() {
    if (this.prevLine) this.prevLine.nextLine = this.nextLine
    if (this.nextLine) this.nextLine.prevLine = this.prevLine
  }
  public get peerOrder() {
    return this.prevLine?.order ?? this.order
  }
}

export class LayoutEndPoint extends LayoutLine {
  public targetRow: number
  public farthestLine: LayoutLine | null = null

  constructor(row: LayoutRow, public c: Connector) {
    super(row)
    this.targetRow = c.peer?.layer.row ?? -1
    c.endPoint = this
  }

  public linkDown(line: LayoutLine) {
    if (!this.nextLine) {
      super.linkDown(line)
    }
    this.farthestLine?.linkDown(line)
    this.farthestLine = line
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
  public detach(updateImmediately = false) {
    if (this.c.type == 'input') {
      this.c.peer?.endPoint?.detach(updateImmediately)
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
    if (updateImmediately) {
      this.row.layout.updateLayout(this.row.index + 1)
    }
    return this
  }
  public resumePath(updateImmediately = false) {
    const anotherEnd = this.c.peer?.endPoint
    if (!anotherEnd) return
    if (this.c.type == 'input') {
      anotherEnd.resumePath(updateImmediately)
      return
    }
    this.row.layout.addPath((this.path = new ConnectionPath(this)))
    const endRow = anotherEnd.row.index
    for (let i = this.row.index + 1; i < endRow; i++) {
      let row = this.row.layout.rows[i]
      let newLine = new LayoutLine(row)
      this.linkDown(newLine)
      row.attachItem(newLine)
    }
    this.linkDown(anotherEnd)
    if (updateImmediately) {
      this.row.layout.updateLayout(this.row.index + 1)
    }
    return this
  }
  public get order() {
    return this.c.layer.layout!.order ?? 0
  }
}
