import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'
import { Layer } from '@/component/svgCompoent/Layer'
import { Scene } from '@/component/svgCompoent/Scene'
import { exampleLayer } from '@/config/layer'

import { Box, Button } from '@mui/joy'
import { useEffect, useRef } from 'react'

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene>()

  useEffect(() => {
    const test1 = new Layer(exampleLayer, {
      id: 'zpqqUgqJLwdlVLG3jxiGb',
      name: 'Conv2D',
      parameters: {
        in_channels: 3,
        out_channels: 32,
        kernel_size: [3, 3],
        stride: [1, 1],
        padding: [0, 0],
        dilation: [1, 1],
        groups: 1,
        bias: true,
        padding_mode: 'zeros',
      },
      inputs: [{ id: 'zpqqUgqJLwdlVLG3jxiGb-0' }],
      outputs: [{ id: 'zpqqUgqJLwdlVLG3jxiGb-1', peer: 'aQrz_4xUM15UyjQaoAEVU-0' }],
      row: 0,
    })
    const test2 = new Layer(exampleLayer, {
      id: 'aQrz_4xUM15UyjQaoAEVU',
      name: 'Conv2D',
      parameters: {
        in_channels: 3,
        out_channels: 32,
        kernel_size: [3, 3],
        stride: [1, 1],
        padding: [0, 0],
        dilation: [1, 1],
        groups: 1,
        bias: true,
        padding_mode: 'zeros',
      },
      inputs: [{ id: 'aQrz_4xUM15UyjQaoAEVU-0', peer: 'zpqqUgqJLwdlVLG3jxiGb-1' }],
      outputs: [{ id: 'aQrz_4xUM15UyjQaoAEVU-1', peer: '5KpmQ4IvuVRVOzfQ35rTR-0' }],
      row: 1,
    })
    const test3 = new Layer(exampleLayer, {
      id: '5KpmQ4IvuVRVOzfQ35rTR',
      name: 'Conv2D',
      parameters: {
        in_channels: 3,
        out_channels: 32,
        kernel_size: [3, 3],
        stride: [1, 1],
        padding: [0, 0],
        dilation: [1, 1],
        groups: 1,
        bias: true,
        padding_mode: 'zeros',
      },
      inputs: [{ id: '5KpmQ4IvuVRVOzfQ35rTR-0', peer: 'aQrz_4xUM15UyjQaoAEVU-1' }],
      outputs: [{ id: '5KpmQ4IvuVRVOzfQ35rTR-1' }],
      row: 2,
    })

    sceneRef.current = new Scene([test1, test2, test3], containerRef.current!)

    return () => {
      sceneRef.current?.dispose()
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
      <Button onClick={() => console.log(JSON.stringify(sceneRef.current?.toJSON()))}>
        保存至控制台
      </Button>
    </Box>
  )
}
Component.displayName = 'DLEditor'

export const ErrorBoundary = SimpleErrorBoundary
