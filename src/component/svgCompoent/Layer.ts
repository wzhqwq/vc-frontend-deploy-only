import { Container, G } from "@svgdotjs/svg.js"

export class Layer {
  public layer: G
  constructor(scene: Container) {
    this.layer = scene.group().addClass('layer')
  }
}
