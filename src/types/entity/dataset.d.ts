export interface Dataset {
  /**
   * 创建时间
   */
  created_at: string;
  /**
   * 数据集描述
   */
  description: string;
  /**
   * 数据集id
   */
  id: number;
  /**
   * 是否公开
   */
  private: boolean;
  /**
   * 实际任务id
   */
  task_id: number;
  /**
   * 数据集标题
   */
  title: string;
  /**
   * 所属用户id
   */
  user_id: number;
}
