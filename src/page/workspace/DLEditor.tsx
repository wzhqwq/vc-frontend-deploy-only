import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'
import { Layer } from '@/component/svgCompoent/Layer'
import { scene } from '@/component/svgCompoent/scene'
import { exampleLayer } from '@/config/layer'

import { Box, Button } from '@mui/joy'
import { useEffect, useRef } from 'react'

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)
  const testLayerRef = useRef<Layer>()
  const testLayer2Ref = useRef<Layer>()

  useEffect(() => {
    scene.addTo(containerRef.current!)
    testLayerRef.current = new Layer(scene, exampleLayer)
    testLayer2Ref.current = new Layer(scene, exampleLayer)

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
      <Button
        onClick={() =>
          console.log(
            JSON.stringify([testLayerRef.current?.toJSON(), testLayer2Ref.current?.toJSON()]),
          )
        }
      >
        保存至控制台
      </Button>
    </Box>
  )
}
Component.displayName = 'DLEditor'

export const ErrorBoundary = SimpleErrorBoundary
