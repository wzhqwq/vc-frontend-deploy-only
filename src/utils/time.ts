import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export default dayjs

export function formatTime(time: string, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}
export function formatDate(time: string, format = 'YYYY-MM-DD') {
  return dayjs(time).format(format)
}
