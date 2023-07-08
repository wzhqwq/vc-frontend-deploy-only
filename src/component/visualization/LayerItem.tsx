import { LayerConfig } from '@/types/config/deepLearning'
import { Box, CircularProgress, Stack } from '@mui/joy'
import { memo, useEffect, useRef, useState } from 'react'
import { Layer } from '../svgCompoent/Layer'

export interface LayerItemProps {
  config: LayerConfig<any>
}

function LayerItem({ config }: LayerItemProps) {
  const [src, setSrc] = useState<string>('')
  const [dragging, setDragging] = useState<boolean>(false)
  const layerToDrag = useRef<Layer>()
  const [maxWidth, setMinWidth] = useState<number>(0)

  useEffect(() => {
    const layer = new Layer(config)
    layerToDrag.current = layer
    setSrc(layer.toImageSrc())
  }, [config])
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setMinWidth(img.width)
    }
    img.src = src
  }, [src])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!src || !layerToDrag.current) {
      e.preventDefault()
      return
    }
    setDragging(true)
    e.dataTransfer.setData('layer', layerToDrag.current.id)
  }
  const handleDragEnd = () => {
    setDragging(false)
    if (layerToDrag.current?.scene) layerToDrag.current = new Layer(config)
  }

  return (
    <Stack direction='row' alignItems='center' justifyContent='center'>
      {src ? (
        <Box
          component="img"
          src={src}
          alt={config.name}
          sx={{
            filter: dragging ? 'opacity(0.5)' : 'none',
            transition: 'filter .3s',
            width: '100%',
            display: 'block',
            maxWidth,
          }}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <CircularProgress />
      )}
    </Stack>
  )
}

export default memo(LayerItem)
