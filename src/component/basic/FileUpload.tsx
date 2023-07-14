import { createRef } from 'react'

import { useFileInfo, useUploadFile } from '@/api/files'
import { CircularProgress, IconButton, Sheet, Stack, Typography } from '@mui/joy'
import { baseUrl } from '@/api/network'

import Description from '@mui/icons-material/Description'
import Delete from '@mui/icons-material/Delete'
import AddRounded from '@mui/icons-material/AddRounded'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import { download } from '@/utils/action'

export interface FileUploadProps {
  value: string
  readonly?: boolean
  onChange?: (fileName: string) => void
  onRemove?: () => void
}

export default function FileUpload({ value, readonly, onChange, onRemove }: FileUploadProps) {
  const formRef = createRef<HTMLFormElement>()
  const { uploadFile, uploadingFile } = useUploadFile()
  const { fileInfo } = useFileInfo(value)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    let file: File = e.target.files[0]
    formRef.current?.reset()

    uploadFile({ file }).then(({ filename }) => onChange?.(filename))
  }

  const triggerDownload = () => {
    if (!value || !fileInfo) return
    download(value, fileInfo.extension)
  }

  return (
    <Sheet
      sx={{
        p: 2,
        my: 0.5,
        position: 'relative',
        width: 40,
        height: 40,
        input: {
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        },
        form: {
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          m: 0,
        },
      }}
      variant="soft"
      color="primary"
    >
      {uploadingFile ? (
        <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
          <CircularProgress />
          <Typography level="body3" color="primary">
            上传中
          </Typography>
        </Stack>
      ) : value ? (
        <>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%' }}
            onClick={triggerDownload}
          >
            <Description fontSize="large" />
            <Typography level="body2" sx={{ mb: -1 }} color="primary">
              {fileInfo?.extension.toUpperCase()}
            </Typography>
          </Stack>
          {!readonly && (
            <IconButton
              size="sm"
              onClick={onRemove}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                transform: 'translate(30%, -30%)',
              }}
              color="danger"
              variant="solid"
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </>
      ) : readonly ? (
        <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
          <QuestionMarkIcon fontSize="large" />
          <Typography level="body3" color="primary">
            未提供
          </Typography>
        </Stack>
      ) : (
        <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
          <AddRounded fontSize="large" />
          <form ref={formRef}>
            <input type="file" onChange={handleFileChange} />
          </form>
        </Stack>
      )}
    </Sheet>
  )
}
