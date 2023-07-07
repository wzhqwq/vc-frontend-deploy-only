export interface Model {
  /**
   * 模型id
   */
  id: number;
  /**
   * 所有者用户id
   */
  user_id: number;
  /**
   * 模型文件id
   */
  file_id: number;
  /**
   * 模型类型
   */
  kind: number;
  /**
   * 模型标题
   */
  title: string;
  /**
   * 模型描述
   */
  description: string;
  /**
   * 是否私有
   */
  private: boolean;
  /**
   * 创建时间
   */
  created_at: string;
}