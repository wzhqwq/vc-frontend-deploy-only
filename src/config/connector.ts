import { joyTheme } from '@/theme'
import { DynamicShape } from '@/types/config/deepLearning'
import { ShapeParameter, LayerParameters } from '@/types/config/parameter'
import { Text } from '@svgdotjs/svg.js'

const shortNameAttr = { fill: joyTheme.vars.palette.primary[500], 'font-weight': 'bold' }
const placeholderAttr = { fill: joyTheme.vars.palette.neutral[100], 'font-size': 12 }
const valueAttr = { fill: joyTheme.vars.palette.primary[50] }

// {"w": {"13" => "w1", "45" => "w2", "3" => "w3"}}
const virtualValueMap: Record<string, Map<string, string>> = {}

export function renderConnectorLabel<P extends LayerParameters>(
  shapeParameter: ShapeParameter<P>,
  inputs: DynamicShape[],
  parameters: P,
) {
  return new Text().font({ size: 18 }).fill('#FFF').text((add) => {
    add.plain('(')

    shapeParameter.getShape(inputs, parameters).forEach((v, i) => {
      if (i != 0) {
        add.plain(',')
      }
      if (v.available) {
        let str = v.value.toFixed(0)
        if (v.virtual) {
          let map = virtualValueMap[shapeParameter.shortNames[i]]
          if (!map) {
            map = new Map()
            virtualValueMap[shapeParameter.shortNames[i]] = map
          }
          let shortName = map.get(str)
          if (!shortName) {
            shortName = shapeParameter.shortNames[i] + map.size
            map.set(str, shortName)
          }
          add.tspan(shortName).attr(shortNameAttr)
          return
        }
        add.tspan(str).attr(valueAttr)
        return
      }
      add.tspan(shapeParameter.placeholders[i]).attr(placeholderAttr)
    })

    add.plain(')')
  })
}
