import { Connector } from '@/component/svgCompoent/Connector'
import { scene } from '@/component/svgCompoent/scene'
import { connectorOrigins } from '@/config/connector'

import { Box } from '@mui/joy'
import { useEffect, useRef } from 'react'

export default function DLEditor() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scene.addTo(containerRef.current!)
    const group = scene.group().translate(100, 100)
    const rect = group.rect(200, 150).fill('#f06')
    const connector1 = new Connector(group, rect.bbox(), 'test', connectorOrigins.topLeft, 'input')
    const connector2 = new Connector(group, rect.bbox(), 'test', connectorOrigins.bottomCenter, 'output')
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
