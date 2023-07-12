export interface User {
  /**
   * 用户邮箱
   */
  email: string
  /**
   * 用户id
   */
  id: number
  /**
   * 是否是特殊匿名用户
   */
  is_anon: boolean
  /**
   * 用户角色
   */
  role_id: number
}
