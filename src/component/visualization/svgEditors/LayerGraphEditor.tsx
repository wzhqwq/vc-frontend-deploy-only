import SaveIcon from '@mui/icons-material/Save'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

import ParameterInput from '@/component/basic/ParameterInput'
import { Scene } from '@/component/svgCompoent/Scene'
import LayerItem from '@/component/visualization/piece/LayerItem'
import {
  normalLayers,
  inputLayers,
  lossLayers,
  tensorProcessingLayers,
} from '@/config/deepLearning/layers'
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from '@mui/joy'
import { Layer } from '@/component/svgCompoent/Layer'
import { Popover } from '@mui/material'
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLayerData } from '@/api/files'
import { joyTheme } from '@/theme'

interface LayerGraphEditorProps {
  filename?: string
  onSave?: (filename: string) => void
  onClose?: () => void
  readonly?: boolean
}

const allLayers = [...normalLayers, ...inputLayers, ...lossLayers, ...tensorProcessingLayers]
export default function LayerGraphEditor({
  filename,
  onSave,
  onClose,
  readonly,
}: LayerGraphEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState<Scene>()
  const [anchorEl, setAnchorEl] = useState<null | SVGElement>(null)
  const [layer, setLayer] = useState<Layer | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const { layerData, fetchingLayer, uploadLayer, uploadingLayer } = useLayerData(filename ?? 'new')

  useEffect(() => {
    const layers = layerData.map((data) => {
      const layerConfig = allLayers.find((l) => l.name == data.name)
      if (!layerConfig) throw new Error('名称错误')
      const layer = new Layer(layerConfig, data)
      layer.initializeConnectors(data)
      return layer
    })
    const scene = new Scene(layers, (layer) => {
      setLayer(layer)
      setAnchorEl(layer.el.node)
    })
    setScene(scene)
    scene.attach(containerRef.current!)

    return () => {
      scene.dispose()
      setScene(undefined)
      setAnchorEl(null)
      setLayer(null)
    }
  }, [layerData, fullscreen])

  const handleSave = useCallback(() => {
    if (!scene) return
    uploadLayer(scene.toJSON()).then(({ filename }) => {
      onSave?.(filename)
    })
  }, [scene])

  const content = (
    <Box
      sx={{
        height: '100%',
        minHeight: 500,
        display: 'grid',
        gridTemplateColumns: readonly ? '1fr' : 'minmax(400px, 1fr) auto 400px',
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
      {!readonly && (
        <>
          <Divider orientation="vertical" />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ p: 1 }}>
              <Typography level="h6">拖拽层至左侧虚线框</Typography>
              <Box sx={{ flexGrow: 1 }} />
              {!onClose && (
                <IconButton onClick={() => setFullscreen((s) => !s)} color="neutral">
                  {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              )}
            </Stack>
            <Divider />
            <LayerListMemo />
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
              {!!onClose && (
                <Button
                  variant="soft"
                  color="neutral"
                  startDecorator={<ChevronLeftIcon />}
                  onClick={onClose}
                >
                  返回
                </Button>
              )}
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
                <Box sx={{ p: 2 }}>
                  <Typography level="h6">设置参数： {layer.config.name}</Typography>
                </Box>
                <Divider />
                <LayerInfo layer={layer} onClose={() => setAnchorEl(null)} />
              </>
            )}
          </Popover>
        </>
      )}
      {readonly &&
        (onClose ? (
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={onClose}
            color="neutral"
          >
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setFullscreen((s) => !s)}
            color="neutral"
          >
            {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        ))}
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

  return onClose ? (
    content
  ) : fullscreen ? (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: joyTheme.vars.palette.background.body,
        zIndex: joyTheme.vars.zIndex.modal,
      }}
    >
      {content}
    </Box>
  ) : (
    <Card variant="outlined" sx={{ p: 0, height: 700 }}>
      {content}
    </Card>
  )
}

function LayerList() {
  return (
    <Box
      sx={(theme) => ({
        px: 2,
        pb: 2,
        display: 'grid',
        rowGap: 4,
        columnGap: 2,
        gridTemplateColumns: '1fr 1fr',
        overflow: 'auto',
        minHeight: 0,
        '.MuiTypography-root': {
          position: 'sticky',
          top: 0,
          gridColumn: '1 / -1',
          bgcolor: theme.vars.palette.primary[50],
          mx: -2,
          px: 2,
          py: 1,
        },
      })}
    >
      <Typography level="h6">输入层</Typography>
      {inputLayers.map((layer) => (
        <LayerItem config={layer} key={layer.name} />
      ))}
      <Typography level="h6">中间层</Typography>
      {normalLayers.map((layer) => (
        <LayerItem config={layer} key={layer.name} />
      ))}
      <Typography level="h6">loss层</Typography>
      {lossLayers.map((layer) => (
        <LayerItem config={layer} key={layer.name} />
      ))}
      <Typography level="h6">张量处理层</Typography>
      {tensorProcessingLayers.map((layer) => (
        <LayerItem config={layer} key={layer.name} />
      ))}
    </Box>
  )
}
const LayerListMemo = memo(LayerList)

function LayerInfo({ layer, onClose }: { layer: Layer; onClose: () => void }) {
  const methods = useForm<{ parameters: any }>({
    defaultValues: { parameters: layer.parameters },
  })
  const {
    formState: { isValid },
    handleSubmit,
  } = methods
  const onSubmit: SubmitHandler<{ parameters: any }> = (data) => {
    layer.updateParameters(data.parameters)
    onClose()
  }
  const handleDelete = () => {
    layer.remove()
    onClose()
  }
  const parameterList = useMemo(
    () =>
      layer.config.parameters.map((parameter) => (
        <ParameterInput key={parameter.key as string} parameter={parameter} prefix="parameters" />
      )),
    [layer.config.parameters],
  )

  const columns = Math.max(2, layer.config.parameters.length / 3).toFixed(0)

  return (
    <Box sx={{ p: 2, minWidth: 200 }}>
      <FormProvider {...methods}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 200px)`,
            gap: 2,
          }}
        >
          {parameterList}
        </Box>
      </FormProvider>
      <Stack direction="row" spacing={2} mt={2}>
        <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          <CheckIcon />
        </Button>
        <Button color="danger" disabled={!isValid} onClick={handleDelete}>
          <DeleteIcon />
        </Button>
      </Stack>
    </Box>
  )
}
