export type ServerGeneratedKeys = 'id' | 'created_at' | 'user_id'

export interface StandardResponse {
  code: number
  data: any
  msg?: string
}
