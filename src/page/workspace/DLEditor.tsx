import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'
import { Scene } from '@/component/svgCompoent/Scene'
import LayerItem from '@/component/visualization/LayerItem'
import { layers } from '@/config/deepLearning/layers'

import { Box, Button } from '@mui/joy'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState<Scene>()

  useEffect(() => {
    setScene(new Scene([], containerRef.current!))

    return () => {
      setScene((s) => {
        s?.dispose()
        return undefined
      })
    }
  }, [])

  const handleSave = useCallback(() => {
    console.log(JSON.stringify(scene?.toJSON()))
  }, [scene])

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 1fr) 400px',
        '.svg-container': {
          overflow: 'hidden',
          svg: {
            display: 'block',
          },
        },
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
        className="svg-container"
      />
      <Box
        sx={{
          borderLeft: '1px solid',
          borderColor: 'divider',
          display: 'grid',
          gridTemplateRows: '1fr auto',
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <Box
            sx={{
              p: 2,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <LayerListMemo />
          </Box>
        </Box>
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="soft" color="neutral" startDecorator={<ChevronLeftIcon />}>
            返回
          </Button>
          <Button variant="solid" color="primary" startDecorator={<SaveIcon />} onClick={handleSave}>
            保存
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
Component.displayName = 'DLEditor'

function LayerList() {
  return layers.map((layer) => <LayerItem config={layer} key={layer.name} />)
}
const LayerListMemo = memo(LayerList)

export const ErrorBoundary = SimpleErrorBoundary
