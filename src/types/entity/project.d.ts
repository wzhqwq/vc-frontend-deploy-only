import { ProjectGraph } from '../config/project'

export interface Project {
  /**
   * 项目配置
   */
  config: ProjectGraph
  /**
   * 创建时间
   */
  created_at: string
  /**
   * 项目id
   */
  id: number
  /**
   * 项目名称
   */
  name: string
  /**
   * 项目描述
   */
  description: string
  /**
   * 是否私有
   */
  private: boolean
  /**
   * 拥有者用户id
   */
  user_id: number
}
