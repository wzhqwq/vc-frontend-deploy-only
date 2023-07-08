import { placeholderToShortName } from '@/config/deepLearning/connectorHelper'
import { joyTheme } from '@/theme'
import { DynamicShape, VirtualValue } from '@/types/config/deepLearning'
import { ShapeParameter, FlatConfigParameters, AnyDimPlaceholders } from '@/types/config/parameter'
import { Container, Text } from '@svgdotjs/svg.js'

const shortNameAttr = { fill: joyTheme.vars.palette.primary[200], 'font-weight': 'bold' }
const placeholderAttr = { fill: joyTheme.vars.palette.neutral[100], 'font-size': 12 }
const valueAttr = { fill: joyTheme.vars.palette.primary[50] }

export class Label<P extends FlatConfigParameters> {
  // {"w": {"13" => "w1", "45" => "w2", "3" => "w3"}}
  public static virtualValueMap: Record<string, Map<string, string>> = {}

  public readonly label: Text
  constructor(container: Container, private readonly shapeParameter: ShapeParameter<P>) {
    this.label = container.text('').font({ size: 18 }).fill('#FFF')
  }

  public renderFullyUnknown() {
    return this.label.clear().text((add) => {
      add.plain('(')

      if (this.shapeParameter.anyDimension) {
        add.tspan('any dimension').attr(placeholderAttr)
      } else {
        this.shapeParameter.placeholders.forEach((v, i) => {
          if (i != 0) add.plain(',')
          add.tspan(v).attr(placeholderAttr)
        })
      }

      add.plain(')')
    })
  }

  update(shape: VirtualValue[] | undefined) {
    if (!shape) return this.renderFullyUnknown()
    return this.label.clear().text((add) => {
      add.plain('(')

      shape.forEach((v, i) => {
        const placeholder = this.shapeParameter.anyDimension
          ? (`d${i + 1}` as AnyDimPlaceholders)
          : this.shapeParameter.placeholders[i]
        if (i != 0) add.plain(',')
        if (v.available) {
          let valueStr = v.value.toFixed(0)
          if (v.virtual) {
            const shortName = this.shapeParameter.anyDimension
              ? String.fromCharCode(97 + i)
              : placeholderToShortName[placeholder]
            let map = Label.virtualValueMap[shortName]
            if (!map) {
              map = new Map()
              Label.virtualValueMap[shortName] = map
            }
            let name = map.get(valueStr)
            if (!name) {
              name = shortName + map.size
              map.set(valueStr, shortName)
            }
            add.tspan(name).attr(shortNameAttr)
            return
          }
          add.tspan(valueStr).attr(valueAttr)
          return
        }
        add.tspan(placeholder).attr(placeholderAttr)
      })

      add.plain(')')
    })
  }
}
