import { SimpleErrorBoundary } from '@/component/basic/errorBoundaries'
import { Scene } from '@/component/svgCompoent/Scene'
import LayerItem from '@/component/visualization/LayerItem'
import { layers as allLayers } from '@/config/deepLearning/layers'

import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/joy'
import { Layer } from '@/component/svgCompoent/Layer'
import { Popover } from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import SaveIcon from '@mui/icons-material/Save'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import ParameterInput from '@/component/basic/ParameterInput'
import { useLayerData } from '@/api/files'

interface LayerGraphEditorProps {
  filename?: string
  onSave?: (filename: string) => void
}

export default function LayerGraphEditor({ filename, onSave }: LayerGraphEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState<Scene>()
  const [anchorEl, setAnchorEl] = useState<null | SVGElement>(null)
  const [layer, setLayer] = useState<Layer | null>(null)
  const { layerData, fetchingLayer, uploadLayer, uploadingLayer } = useLayerData(filename ?? 'new')

  useEffect(() => {
    const layers = layerData.map((data) => {
      const layerConfig = allLayers.find((l) => l.name == data.name)
      if (!layerConfig) throw new Error('名称错误')
      const layer = new Layer(layerConfig, data)
      layer.initializeConnectors(data)
      return layer
    })
    setScene(
      new Scene(layers, containerRef.current!, (layer) => {
        setLayer(layer)
        setAnchorEl(layer.el.node)
      }),
    )

    return () => {
      setScene((s) => {
        s?.dispose()
        return undefined
      })
      setAnchorEl(null)
      setLayer(null)
    }
  }, [layerData])

  const handleSave = useCallback(() => {
    if (!scene) return
    uploadLayer(scene.toJSON()).then((filename) => {
      onSave?.(filename)
    })
  }, [scene])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        display: 'grid',
        bgcolor: 'white',
        gridTemplateColumns: 'minmax(400px, 1fr) auto 400px',
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
      <Divider orientation="vertical" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography level="h6">拖拽层至左侧虚线框</Typography>
        </Box>
        <Divider />
        <Box sx={{ overflow: 'auto', minHeight: 0, flexGrow: 1 }}>
          <LayerListMemo />
        </Box>
        <Divider />
        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            flexShrink: 0,
          }}
        >
          <Button variant="soft" color="neutral" startDecorator={<ChevronLeftIcon />}>
            返回
          </Button>
          <Button
            variant="solid"
            color="primary"
            startDecorator={<SaveIcon />}
            onClick={handleSave}
            disabled={uploadingLayer || !scene}
            loading={uploadingLayer}
          >
            保存
          </Button>
        </Box>
      </Box>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {layer && (
          <>
            <Box sx={{ borderBottom: '1px solid', borderBottomColor: 'divider', p: 1 }}>
              <Typography level="h6">设置参数： {layer.config.name}</Typography>
            </Box>
            <LayerInfo layer={layer} onClose={() => setAnchorEl(null)} />
          </>
        )}
      </Popover>
      <CircularProgress
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          visibility: fetchingLayer ? 'visible' : 'hidden',
        }}
      />
    </Box>
  )
}

function LayerList() {
  return (
    <Box
      sx={{
        p: 2,
        display: 'grid',
        rowGap: 4,
        columnGap: 2,
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      {allLayers.map((layer) => (
        <LayerItem config={layer} key={layer.name} />
      ))}
    </Box>
  )
}
const LayerListMemo = memo(LayerList)

function LayerInfo({ layer, onClose }: { layer: Layer; onClose: () => void }) {
  const { register, handleSubmit, formState, control } = useForm<any>({
    values: layer.parameters,
  })
  const onSubmit: SubmitHandler<any> = (data) => {
    layer.updateParameters(data)
    onClose()
  }
  const handleDelete = () => {
    layer.remove()
    onClose()
  }
  const parameterList = useMemo(
    () =>
      layer.config.parameters.map((parameter) => (
        <ParameterInput
          key={parameter.key as string}
          parameter={parameter}
          register={register}
          control={control}
        />
      )),
    [layer.config.parameters, register],
  )

  const columns = Math.max(2, layer.config.parameters.length / 3).toFixed(0)

  return (
    <Box sx={{ p: 1, minWidth: 200 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 200px)`,
          gap: 2,
        }}
      >
        {parameterList}
      </Box>
      <Stack direction="row" spacing={1} mt={1}>
        <Button disabled={!formState.isValid} onClick={handleSubmit(onSubmit)}>
          <CheckIcon />
        </Button>
        <Button color="danger" disabled={!formState.isValid} onClick={handleDelete}>
          <DeleteIcon />
        </Button>
      </Stack>
    </Box>
  )
}
