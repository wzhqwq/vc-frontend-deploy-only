import { ConfigParameter, ConfigParameterArray } from '@/types/config/parameter'

export function checkDirty(dirtyFields: any, name: string) {
  const paths = name.split('.')
  let dirtyValue = dirtyFields
  while (paths.length && dirtyValue && typeof dirtyValue === 'object')
    dirtyValue = dirtyValue[paths.shift()!]
  if (dirtyValue === undefined) return false
  if (typeof dirtyValue === 'object') return checkHasTrue(dirtyValue)
  return dirtyValue === true
}
function checkHasTrue(dirtyFields: any): boolean {
  return Object.values(dirtyFields).some((value) => {
    if (value === true) return true
    if (typeof value === 'object') return checkHasTrue(value)
  })
}

// export function generateDefault<T extends Record<any, any>, K extends keyof T>(
//   parameter: ConfigParameter<'dict', K, T>,
// ) {
//   return (
//     parameter.properties?.reduce((obj, property) => {
//       if (property.type == 'dict') {
//         obj[property.key] = generateDefault(property)
//       } else {
//         obj[property.key] = property.default
//       }
//       return obj
//     }, {} as T[K]) ?? {}
//   )
// }
