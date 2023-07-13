import { baseUrl } from "@/api/network"

export function download(filename: string, ext: string) {
  const a = document.createElement('a')
  a.href = baseUrl + `file/files/${filename}`
  a.target = '_blank'
  a.download = '下载.' + ext
  a.click()
}