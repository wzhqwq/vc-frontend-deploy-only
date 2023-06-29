import { SVG } from "@svgdotjs/svg.js";
import { Layer } from "./Layer";
import { LayerData } from "@/types/config/deepLearning";
import { Layout } from "./Layout";

export class Scene {
  public readonly el = SVG().size(1000, 1000).addClass('scene')
  public readonly layout: Layout

  constructor(private layers: Layer[], parent: HTMLElement) {
    this.layout = new Layout(layers)
    layers.forEach((layer) => {
      layer.scene = this
    })
    this.el.add(this.layout.el)
    this.el.addTo(parent)
  }

  public toJSON(): LayerData<any>[] {
    return this.layers.map((l) => l.toJSON())
  }

  public dispose() {
    // this.layout.dispose()
    this.el.remove()
  }
}
