import { DynamicShape } from '@/types/config/deepLearning'
import { ShapeParameter, LayerParameters } from '@/types/config/parameter'

// {"w": {"13" => "w1", "45" => "w2", "3" => "w3"}}
const virtualValueMap: Record<string, Map<string, string>> = {}

export function renderConnectorLabel<P extends LayerParameters>(
  shapeParameter: ShapeParameter<P>,
  inputs: DynamicShape[],
  parameters: P,
) {
  let shape = shapeParameter.getShape(inputs, parameters)
  let label = shape
    .map((v, i) => {
      if (v.available) {
        let str = v.value.toFixed(0)
        if (v.virtual) {
          let map = virtualValueMap[shapeParameter.placeholders[i]]
          if (!map) {
            map = new Map()
            virtualValueMap[shapeParameter.placeholders[i]] = map
          }
          let shortName = map.get(str)
          if (!shortName) {
            shortName = shapeParameter.shortNames[i] + map.size
            map.set(str, shortName)
          }
          return shortName
        }
        return str
      }
      return '?'
    })
    .join(', ')
  return '(' + label + ')'
}
