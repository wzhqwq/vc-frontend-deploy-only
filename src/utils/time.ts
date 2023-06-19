import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export default dayjs

export function formatTime(time: number, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time * 1000).format(format)
}
