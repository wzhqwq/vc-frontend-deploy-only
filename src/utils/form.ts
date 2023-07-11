export function checkDirty(dirtyFields: any, name: string) {
  const paths = name.split('.')
  let dirtyValue = dirtyFields
  while (paths.length && dirtyValue && typeof dirtyValue === 'object') dirtyValue = dirtyValue[paths.shift()!]
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
