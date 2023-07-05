import { CreateLayerConfigOptions, LayerConfig, LayerRenderer } from '@/types/config/deepLearning'
import { LayerParameters } from '@/types/config/parameter'
import { joyTheme } from '@/theme'
import { Box, Rect } from '@svgdotjs/svg.js'

export function createLayerConfig<P extends LayerParameters>(options: CreateLayerConfigOptions<P>) {
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
