import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'
import { Scene } from '@/component/svgCompoent/Scene'
import { layers } from '@/config/deepLearning/layers'

import { Box, Button } from '@mui/joy'
import { useEffect, useRef, useState } from 'react'

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState<Scene>()

  useEffect(() => {
    setScene(new Scene([], containerRef.current!))

    return () => {
      setScene(s => {
        s?.dispose()
        return undefined
      })
    }
  }, [])

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 1fr) 300px',
        gap: 2,
        '.svg-container': {
          overflow: 'hidden',
          svg: {
            display: 'block',
          }
        }
      }}
    >
      <div
        ref={containerRef}
        draggable
        onDragStart={scene?.dragStart}
        onDragEnd={scene?.dragEnd}
        onDragEnter={scene?.dragEnter}
        onDragLeave={scene?.dragLeave}
        onDrop={scene?.drop}
        className='svg-container'
      />
      <Box
        sx={{
          borderLeft: '1px solid',
          borderColor: 'divider',
          p: 2
        }}
      >
      </Box>
    </Box>
  )
}
Component.displayName = 'DLEditor'

export const ErrorBoundary = SimpleErrorBoundary
