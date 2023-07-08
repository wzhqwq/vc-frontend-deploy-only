import { CreateLayerConfigOptions, LayerConfig, LayerRenderer } from '@/types/config/deepLearning'
import { FlatConfigParameters } from '@/types/config/parameter'
import { joyTheme } from '@/theme'
import { Box, Path, Rect } from '@svgdotjs/svg.js'

export function createLayerConfig<P extends FlatConfigParameters>(
  options: CreateLayerConfigOptions<P>,
) {
  return {
    ...options,
    defaultParameters: options.parameters.reduce(
      (acc, p) => ({ ...acc, [p.key]: p.default }),
      {} as P,
    ),
  } as LayerConfig<P>
}

const darkPrimary = joyTheme.vars.palette.primary[700]
const lightPrimary = joyTheme.vars.palette.primary[300]

export const rectRenderer1: LayerRenderer = {
  color: 'dark',
  getElement: (box: Box) => {
    return new Rect().size(box.w, box.h).move(box.x, box.y).radius(10).fill(darkPrimary)
  },
}

export const rectRenderer2: LayerRenderer = {
  color: 'light',
  getElement: (box: Box) => {
    return new Rect().size(box.w, box.h).move(box.x, box.y).fill(lightPrimary)
  },
}

export const sumRenderer: LayerRenderer = {
  color: 'light',
  getElement: (box: Box) => {
    const size = Math.min(box.w, box.h)
    const x = box.x + box.w / 2 - size / 2
    const y = box.y + box.h / 2 - size / 2
    return new Path()
      .plot(
        `M ${x + size / 2} ${y} ` +
          `a ${size / 2} ${size / 2} 0 1 0 0 ${size}` +
          `a ${size / 2} ${size / 2} 0 1 0 0 ${-size}` +
          `M ${x + size / 2} ${y} ` +
          `l 0 ${size} ` +
          `M ${x} ${y + size / 2} ` +
          `l ${size} 0`,
      )
      .fill('none')
      .stroke({ color: darkPrimary, width: 4 })
  },
}

export const productRenderer: LayerRenderer = {
  color: 'light',
  getElement: (box: Box) => {
    const size = Math.min(box.w, box.h)
    const x = box.x + box.w / 2 - size / 2
    const y = box.y + box.h / 2 - size / 2
    return new Path()
      .plot(
        `M ${x + size / 2} ${y} ` +
          `a ${size / 2} ${size / 2} 0 1 0 0 ${size}` +
          `a ${size / 2} ${size / 2} 0 1 0 0 ${-size}` +
          `M ${x + size / 2} ${y + 4} ` +
          `a ${size / 2 - 4} ${size / 2 - 4} 0 1 0 0 ${size - 8}` +
          `a ${size / 2 - 4} ${size / 2 - 4} 0 1 0 0 ${-size + 8}` +
          `M ${x + size / 2} ${y + size / 4} ` +
          `a ${size / 4} ${size / 4} 0 1 0 0 ${size / 2}` +
          `a ${size / 4} ${size / 4} 0 1 0 0 ${-size / 2}`,
      )
      .fill({ color: darkPrimary, rule: 'evenodd' })
  },
}

export const splitRenderer: LayerRenderer = {
  color: 'light',
  getElement: (box: Box) => {
    let { x, y, w, h } = box
    x += 10
    w -= 20
    return new Path()
      .plot(
        `M ${x + w / 3} ${y} l 0 ${h} ` +
          `M ${x + (2 * w) / 3} ${y} l 0 ${h} ` +
          `M ${x + w / 3} ${y + h / 2} l ${-w / 3} 0 ` +
          `M ${x + (2 * w) / 3} ${y + h / 2} l ${w / 3} 0 ` +
          `M ${x + w / 10} ${y + h / 2 - w / 10} l ${-w / 10} ${w / 10} l ${w / 10} ${w / 10}` +
          `M ${x + w - w / 10} ${y + h / 2 - w / 10} l ${w / 10} ${w / 10} l ${-w / 10} ${w / 10}`,
      )
      .fill('none')
      .stroke({ color: darkPrimary, width: 4 })
  },
}

export const copyRenderer: LayerRenderer = {
  color: 'light',
  getElement: (box: Box) => {
    const size = Math.min(box.w, box.h)
    const x = box.x + box.w / 2 - size / 2
    const y = box.y + box.h / 2 - size / 2
    return new Path()
      .plot(
        `M ${x} ${y} h ${size * 2 / 3} v ${size * 2 / 3} ` +
        `h ${-size * 2 / 3} v ${-size * 2 / 3} ` +
        `M ${x + size * 5 / 6} ${y + size / 3} h ${size / 6} v ${size * 2 / 3} ` +
        `h ${-size * 2 / 3} v ${-size / 6} ` +
        `h ${size / 2} v ${-size / 3} `,
      )
      .fill({ color: darkPrimary, rule: 'evenodd' })
  },
}
