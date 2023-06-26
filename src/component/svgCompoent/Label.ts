import { joyTheme } from '@/theme'
import { DynamicShape } from '@/types/config/deepLearning'
import { ShapeParameter, LayerParameters } from '@/types/config/parameter'
import { Container, Text } from '@svgdotjs/svg.js'

const shortNameAttr = { fill: joyTheme.vars.palette.primary[500], 'font-weight': 'bold' }
const placeholderAttr = { fill: joyTheme.vars.palette.neutral[100], 'font-size': 12 }
const valueAttr = { fill: joyTheme.vars.palette.primary[50] }

// {"w": {"13" => "w1", "45" => "w2", "3" => "w3"}}
const virtualValueMap: Record<string, Map<string, string>> = {}

export class Label<P extends LayerParameters> {
  public readonly label: Text
  constructor(container: Container, private readonly shapeParameter: ShapeParameter<P>) {
    this.label = container
      .text((add) => {
        add.plain('(')

        shapeParameter.placeholders.forEach((v, i) => {
          if (i != 0) add.plain(',')
          add.tspan(v).attr(placeholderAttr)
        })

        add.plain(')')
      })
      .font({ size: 18 })
      .fill('#FFF')
  }

  update(inputs: DynamicShape[], parameters: P) {
    return this.label.clear().text((add) => {
      add.plain('(')

      this.shapeParameter.getShape(inputs, parameters).forEach((v, i) => {
        if (i != 0) add.plain(',')
        if (v.available) {
          let str = v.value.toFixed(0)
          if (v.virtual) {
            let map = virtualValueMap[this.shapeParameter.shortNames[i]]
            if (!map) {
              map = new Map()
              virtualValueMap[this.shapeParameter.shortNames[i]] = map
            }
            let shortName = map.get(str)
            if (!shortName) {
              shortName = this.shapeParameter.shortNames[i] + map.size
              map.set(str, shortName)
            }
            add.tspan(shortName).attr(shortNameAttr)
            return
          }
          add.tspan(str).attr(valueAttr)
          return
        }
        add.tspan(this.shapeParameter.placeholders[i]).attr(placeholderAttr)
      })

      add.plain(')')
    })
  }
}