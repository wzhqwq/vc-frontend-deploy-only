import { SVG } from '@svgdotjs/svg.js'
import { Layer } from './Layer'
import { LayerData } from '@/types/config/deepLearning'
import { Layout } from './Layout'

export class Scene {
  public readonly el = SVG().addClass('scene')
  public readonly layout: Layout
  private activeLayer: Layer | null = null
  private moving = false

  constructor(private layers: Layer[], private parent: HTMLElement, private onLayerClick: (layer: Layer) => void) {
    this.layout = new Layout(layers)
    layers.forEach((layer) => {
      layer.scene = this
    })
    this.el.add(this.layout.el)
    this.updateSize()
    this.layout.el.translate((this.el.width() as number) / 2, 20)
    this.el.addTo(parent)

    this.dragStart = this.dragStart.bind(this)
    this.dragEnter = this.dragEnter.bind(this)
    this.dragEnd = this.dragEnd.bind(this)
    this.dragLeave = this.dragLeave.bind(this)
    this.drop = this.drop.bind(this)
    this.updateSize = this.updateSize.bind(this)
    this.mouseMove = this.mouseMove.bind(this)

    this.el.on('mousedown', (e) => {
      if ((e as MouseEvent).button) return
      this.moving = true
    })
    this.el.on('mouseup', () => {
      this.moving = false
    })

    window.addEventListener('resize', this.updateSize)
    window.addEventListener('mousemove', this.mouseMove)
  }

  private updateSize() {
    this.el.size(this.parent.clientWidth, this.parent.clientHeight)
  }
  public mouseMove(e: MouseEvent) {
    if (!this.moving) return
    this.layout.el.translate(e.movementX, e.movementY)
  }

  public toJSON(): LayerData<any>[] {
    return this.layers.map((l) => l.toJSON())
  }

  public dispose() {
    this.layout.dispose()
    this.el.remove()
    this.layers.forEach((l) => l.cleanup())
    window.removeEventListener('resize', this.updateSize)
    window.removeEventListener('mousemove', this.mouseMove)
  }

  public setPossibleDraggingLayer(layer: Layer | null) {
    this.activeLayer = layer
  }
  public setSelectedLayer(layer: Layer) {
    this.onLayerClick(layer)
  }

  public dragStart(e: React.DragEvent<HTMLDivElement>) {
    if (this.activeLayer) {
      let img = new Image()
      img.src = this.activeLayer.src
      e.dataTransfer!.setDragImage(img, 0, 0)
      e.dataTransfer!.setData('layer', this.activeLayer.id)
      if (this.activeLayer.layout)
        e.dataTransfer!.setData(`available:${this.activeLayer.layout.availableRow.join(',')}`, '')
      e.dataTransfer!.effectAllowed = 'move'
    } else {
      e.preventDefault()
    }
  }
  public dragEnter(e: React.DragEvent<HTMLDivElement>) {
    if (!e.dataTransfer?.types.includes('layer')) return
    this.el.addClass('layer-dragging')
  }
  public dragEnd(e: React.DragEvent<HTMLDivElement>) {
    this.el.removeClass('layer-dragging')
    if (this.activeLayer) {
      this.activeLayer.el.removeClass('dragging')
      this.activeLayer = null
    }
  }
  public drop(e: React.DragEvent<HTMLDivElement>) {
    if (!e.dataTransfer?.types.includes('layer')) return
    this.el.removeClass('layer-dragging')
    const id = e.dataTransfer.getData('layer')
    const layer = Layer.layers.get(id)!
    if (!layer.scene) {
      layer.scene = this
      this.layers.push(layer)
    }
  }
  public dragLeave(e: React.DragEvent<HTMLDivElement>) {
    // if (!(e.target as HTMLElement).classList.contains('scene')) return
    // this.el.removeClass('layer-dragging')
  }
}
