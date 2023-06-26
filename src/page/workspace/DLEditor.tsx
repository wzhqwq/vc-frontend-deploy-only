import { Layer } from '@/component/svgCompoent/Layer'
import { scene } from '@/component/svgCompoent/scene'
import { exampleLayer } from '@/config/layer'

import { Box } from '@mui/joy'
import { useEffect, useRef } from 'react'

export default function DLEditor() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scene.addTo(containerRef.current!)
    const testLayer = new Layer(scene, exampleLayer)
    const testLayer2 = new Layer(scene, exampleLayer)
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
