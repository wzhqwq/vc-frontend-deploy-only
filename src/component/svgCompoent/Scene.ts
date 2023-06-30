import { SVG } from '@svgdotjs/svg.js'
import { Layer } from './Layer'
import { LayerData } from '@/types/config/deepLearning'
import { Layout } from './Layout'

export class Scene {
  public readonly el = SVG().size(1000, 1000).addClass('scene')
  public readonly layout: Layout
  private possibleDraggingLayer: Layer | null = null

  constructor(private layers: Layer[], parent: HTMLElement) {
    this.layout = new Layout(layers)
    layers.forEach((layer) => {
      layer.scene = this
    })
    this.el.add(this.layout.el)
    this.layout.el.translate(300, 0)
    this.el.addTo(parent)

    this.dragStart = this.dragStart.bind(this)
    this.dragOver = this.dragOver.bind(this)
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
    this.possibleDraggingLayer = layer
  }

  public dragStart(e: React.DragEvent<HTMLDivElement>) {
    if (this.possibleDraggingLayer) {
      // this.layout.removeLayer(this.possibleDraggingLayer)
        
      // e.dataTransfer!.setDragImage(img, 0, 0)
    } else {
      e.preventDefault()
    }
  }
  public dragOver(e: React.DragEvent<HTMLDivElement>) {
    this.el.addClass('layer-dragging')
  }
  public dragEnd(e: React.DragEvent<HTMLDivElement>) {
    this.el.removeClass('layer-dragging')
  }
  public dragLeave(e: React.DragEvent<HTMLDivElement>) {
    this.el.removeClass('layer-dragging')
  }
  public drop(e: DragEvent) {}
}
