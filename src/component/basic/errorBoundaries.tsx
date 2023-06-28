import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function SimpleErrorBoundary() {
  let error = useRouteError()
  return isRouteErrorResponse(error) ? (
    <h1>功能加载失败：{error.status}</h1>
  ) : (
    <h1>页面发生错误：{(error as Error).message}</h1>
  )
}
SimpleErrorBoundary.displayName = 'SimpleErrorBoundary'
