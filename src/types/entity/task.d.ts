export interface TaskGroup {
  /**
   * 创建时间
   */
  created_at: string
  /**
   * 任务组id
   */
  id: number
  /**
   * 附属项目id
   */
  project_id: number
  /**
   * 运行状态
   */
  status: number
  /**
   * 拥有者用户id
   */
  user_id: number
}

export interface Task {
  /**
   * 算法名称
   */
  algo: string
  /**
   * 创建时间
   */
  created_at: string
  /**
   * 任务配置项id
   */
  data_id: number
  /**
   * 异常描述
   */
  exception: null | TaskException
  /**
   * 任务id
   */
  id: number
  /**
   * 日志
   */
  log: string
  /**
   * 前置任务id数组
   */
  pre_task_ids: number[]
  /**
   * 结果描述项id
   */
  result_id: number
  /**
   * 任务运行状态
   */
  status: number
  /**
   * 所属任务组id
   */
  task_group_id: number
  /**
   * 拥有者用户id
   */
  user_id: number
}

export interface TaskException {
  /**
   * 异常代号
   */
  code: number
  /**
   * 异常消息
   */
  message: string
  /**
   * 异常位置描述
   */
  position: string
}
