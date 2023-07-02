import { SVG } from '@svgdotjs/svg.js'
import { Layer } from './Layer'
import { LayerData } from '@/types/config/deepLearning'
import { Layout } from './Layout'

export class Scene {
  public readonly el = SVG().size(1000, 1000).addClass('scene')
  public readonly layout: Layout
  private activeLayer: Layer | null = null

  constructor(private layers: Layer[], parent: HTMLElement) {
    this.layout = new Layout(layers)
    layers.forEach((layer) => {
      layer.scene = this
    })
    this.el.add(this.layout.el)
    this.layout.el.translate(300, 0)
    this.el.addTo(parent)

    this.dragStart = this.dragStart.bind(this)
    this.dragEnter = this.dragEnter.bind(this)
    this.dragEnd = this.dragEnd.bind(this)
    this.dragLeave = this.dragLeave.bind(this)
  }

  public toJSON(): LayerData<any>[] {
    return this.layers.map((l) => l.toJSON())
  }

  public dispose() {
    // this.layout.dispose()
    this.el.remove()
  }

  public setPossibleDraggingLayer(layer: Layer | null) {
    this.activeLayer = layer
  }

  public dragStart(e: React.DragEvent<HTMLDivElement>) {
    if (this.activeLayer) {
      let img = new Image()
      img.src = this.activeLayer.src
      e.dataTransfer!.setDragImage(img, 0, 0)
      e.dataTransfer!.setData('layer', this.activeLayer.id)
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
  public dragLeave(e: React.DragEvent<HTMLDivElement>) {
    // this.el.removeClass('layer-dragging')
    // console.log('leave--')
  }
}
