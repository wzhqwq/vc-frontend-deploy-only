import { Connector } from '@/component/svgCompoent/Connector'
import { scene } from '@/component/svgCompoent/scene'

import { Box } from '@mui/joy'
import { useEffect, useRef } from 'react'

export default function DLEditor() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scene.addTo(containerRef.current!)
    const group = scene.group().translate(100, 100)
    const rect = group.rect(200, 150).fill('#f06')
    const connector1 = new Connector(group, 'test', { side: 'top', pos: [20, 0] }, 'input')
    const connector2 = new Connector(group, 'test', { side: 'bottom', pos: [50, 150] }, 'output')
    return () => {
      scene.clear().remove()
    }
  }, [])

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
        ref={containerRef}
      />
    </Box>
  )
}
