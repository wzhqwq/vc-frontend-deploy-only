import { nanoid } from 'nanoid'
import { LayoutEndPoint, LayoutLine } from './Layout'
import { Path } from '@svgdotjs/svg.js'
import { joyTheme } from '@/theme'
import { LINE_WIDTH } from './Connector'

const STROKE_ATTR = { color: joyTheme.vars.palette.primary[400], width: LINE_WIDTH, linejoin: 'round' }

export class ConnectionPath {
  public static readonly paths = new Map<string, ConnectionPath>()

  public readonly id: string
  public readonly el: Path

  constructor(private startEndPoint: LayoutEndPoint) {
    this.id = nanoid()
    this.el = new Path().stroke(STROKE_ATTR).fill('none')
    ConnectionPath.paths.set(this.id, this)
  }

  public render() {
    const lines = [this.startEndPoint] as LayoutLine[]
    while (lines[0].nextLine) lines.unshift(lines[0].nextLine)
    const points = lines.reverse().flatMap((l) => l.points)
    console.log(points)
    this.el.plot('M' + points.map(([x, y]) => ` ${x} ${y}`).join(' L'))
  }
}
