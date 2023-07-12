/**
 * File
 */
export interface FileInfo {
  /**
   * MIME类型
   */
  content_type: string
  /**
   * 创建时间
   */
  created_at: string
  extension: string
  /**
   * 访问名称
   */
  filename: string
  /**
   * 文件id
   */
  id: number
}
