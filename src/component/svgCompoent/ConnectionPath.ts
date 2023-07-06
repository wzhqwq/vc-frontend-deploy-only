import { nanoid } from 'nanoid'
import { LayoutEndPoint, LayoutLine } from './Layout'
import { Path } from '@svgdotjs/svg.js'
import { joyTheme } from '@/theme'
import { LINE_WIDTH } from './Connector'

const STROKE_ATTR = {
  color: joyTheme.vars.palette.primary[400],
  width: LINE_WIDTH,
  linejoin: 'round',
}

export class ConnectionPath {
  public readonly id: string
  public readonly el: Path

  constructor(private startingEnd: LayoutEndPoint) {
    this.id = nanoid()
    this.el = new Path().stroke(STROKE_ATTR).fill('none')
    this.el.on('contextmenu', (e) => {
      e.preventDefault()

      this.startingEnd.detach()
      this.startingEnd.c.peer?.disconnect()
      this.startingEnd.c.disconnect()
    })
  }

  public render() {
    const lines = [this.startingEnd] as LayoutLine[]
    while (lines[0].nextLine) lines.unshift(lines[0].nextLine)
    const points = lines.reverse().flatMap((l) => l.points)
    this.el.plot('M' + points.map(([x, y]) => ` ${x} ${y}`).join(' L'))
  }

  public dispose() {
    this.el.remove()
  }
}
