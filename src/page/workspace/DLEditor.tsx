import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'
import { Layer } from '@/component/svgCompoent/Layer'
import { Scene } from '@/component/svgCompoent/Scene'
import { layers } from '@/config/deepLearning/layers'

import { Box, Button } from '@mui/joy'
import { useEffect, useRef, useState } from 'react'

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState<Scene>()

  useEffect(() => {
    const test1 = new Layer(layers[0], {
      id: 'zpqqUgqJLwdlVLG3jxiGb',
      name: 'Conv2D',
      parameters: {
        in_channels: 3,
        out_channels: 32,
        kernel_size: [3, 3] as [number, number],
        stride: [1, 1] as [number, number],
        padding: [0, 0] as [number, number],
        dilation: [1, 1] as [number, number],
        groups: 1,
        bias: true,
        padding_mode: 'zeros',
      },
      inputs: [{ id: 'zpqqUgqJLwdlVLG3jxiGb-0' }],
      outputs: [{ id: 'zpqqUgqJLwdlVLG3jxiGb-1', peer: 'aQrz_4xUM15UyjQaoAEVU-0' }],
      row: 0,
    })
    const test2 = new Layer(layers[0], {
      id: 'aQrz_4xUM15UyjQaoAEVU',
      name: 'Conv2D',
      parameters: {
        in_channels: 3,
        out_channels: 32,
        kernel_size: [3, 3] as [number, number],
        stride: [1, 1] as [number, number],
        padding: [0, 0] as [number, number],
        dilation: [1, 1] as [number, number],
        groups: 1,
        bias: true,
        padding_mode: 'zeros',
      },
      inputs: [{ id: 'aQrz_4xUM15UyjQaoAEVU-0', peer: 'zpqqUgqJLwdlVLG3jxiGb-1' }],
      outputs: [{ id: 'aQrz_4xUM15UyjQaoAEVU-1', peer: '5KpmQ4IvuVRVOzfQ35rTR-0' }],
      row: 1,
    })
    const test3 = new Layer(layers[0], {
      id: '5KpmQ4IvuVRVOzfQ35rTR',
      name: 'Conv2D',
      parameters: {
        in_channels: 3,
        out_channels: 32,
        kernel_size: [3, 3] as [number, number],
        stride: [1, 1] as [number, number],
        padding: [0, 0] as [number, number],
        dilation: [1, 1] as [number, number],
        groups: 1,
        bias: true,
        padding_mode: 'zeros',
      },
      inputs: [{ id: '5KpmQ4IvuVRVOzfQ35rTR-0', peer: 'aQrz_4xUM15UyjQaoAEVU-1' }],
      outputs: [{ id: '5KpmQ4IvuVRVOzfQ35rTR-1' }],
      row: 2,
    })
    const test4 = new Layer(layers[0])
    test4.row = 1
    const test5 = new Layer(layers[0])
    test5.row = 2

    setScene(new Scene([test1, test4, test2, test3, test5], containerRef.current!))

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
        gridTemplateColumns: '1fr',
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
    </Box>
  )
}
Component.displayName = 'DLEditor'

export const ErrorBoundary = SimpleErrorBoundary
