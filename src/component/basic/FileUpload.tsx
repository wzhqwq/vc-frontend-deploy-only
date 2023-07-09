import { createRef } from 'react'

import { useUploadFile } from '@/api/files'
import { CircularProgress, IconButton, Sheet, Stack } from '@mui/joy'

import Description from '@mui/icons-material/Description'
import Remove from '@mui/icons-material/Remove'
import AddRounded from '@mui/icons-material/AddRounded'
import { baseUrl } from '@/api/network'
import { Control, Controller } from 'react-hook-form'

export interface FileUploadControlledProps {
  value?: string
  onChange?: (fileName: string) => void
  onRemove?: () => void
}

export function FileUploadControlled({ value, onChange, onRemove }: FileUploadControlledProps) {
  const formRef = createRef<HTMLFormElement>()
  const { uploadFile, uploadingFile } = useUploadFile()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    let file: File = e.target.files[0]
    formRef.current?.reset()

    uploadFile({ file }).then(({ filename }) => onChange?.(filename))
  }

  const triggerDownload = () => {
    if (!value) return
    const a = document.createElement('a')
    a.href = baseUrl + `file/files/${value}`
    a.target = '_blank'
    a.download = value
    a.click()
  }

  return (
    <Stack alignItems="center" spacing={1}>
      <Sheet
        sx={{
          p: 2,
          position: 'relative',
          width: 50,
          height: 50,
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
        <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
          {uploadingFile ? (
            <>
              <CircularProgress />
              <span>上传中</span>
            </>
          ) : value ? (
            <>
              <Description fontSize="large" onClick={triggerDownload} />
              <IconButton
                size="sm"
                onClick={onRemove}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  transform: 'translate(50%, -50%)',
                }}
                color="danger"
                variant="solid"
              >
                <Remove />
              </IconButton>
            </>
          ) : (
            <>
              <AddRounded fontSize="large" />
              <form ref={formRef}>
                <input type="file" onChange={handleFileChange} />
              </form>
            </>
          )}
        </Stack>
      </Sheet>
    </Stack>
  )
}

export function FileUpload({ name, control }: { name: string; control: Control<any> }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FileUploadControlled value={value} onChange={onChange} onRemove={() => onChange('')} />
      )}
    />
  )
}