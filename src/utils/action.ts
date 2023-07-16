import { toUrl } from '@/api/files'

export function download(filename: string, ext: string) {
  const a = document.createElement('a')
  a.href = toUrl(filename)
  a.target = '_blank'
  a.download = '下载.' + ext
  a.click()
}
