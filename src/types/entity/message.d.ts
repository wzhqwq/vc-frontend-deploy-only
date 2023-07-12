export interface Message {
  /**
   * 发出时间
   */
  created_at: string;
  /**
   * 消息id
   */
  id: number;
  /**
   * 消息内容
   */
  message: string;
  /**
   * 是否已读
   */
  read: boolean;
  /**
   * 关联任务组id
   */
  task_group_id: number;
  /**
   * 所属用户id
   */
  user_id: number;
}
