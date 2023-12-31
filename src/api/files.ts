import { LayerData } from '@/types/config/deepLearning'
import { QueryFunction } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { baseUrl, wrapAxios } from './network'
import { useErrorlessQuery, usePost } from './common'
import { FileInfo } from '@/types/entity/file'

export const toUrl = (filename: string) => `${baseUrl}file/files/${filename}`

const fetchPlainFile: QueryFunction<string, string[]> = async ({ queryKey }) => {
  const filename = queryKey[3]
  const response = await fetch(toUrl(filename))
  if (response.status == 404) throw new Error('文件不存在')
  return response.text()
}
const mutateUploadFile = async ({ file }: { file: File }) => {
  const data = new FormData()
  data.append('file', file)
  return await wrapAxios({
    url: baseUrl + 'file/files',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}

export function useUploadFile() {
  const { mutateAsync: uploadFile, isLoading: uploadingFile } = usePost<FileInfo, { file: File }>(
    ['private', 'file', 'files'],
    '上传文件',
    {
      mutationFn: mutateUploadFile,
    },
  )

  return {
    uploadFile,
    uploadingFile,
  }
}

export function usePlainTextFile(filename: string) {
  const { data: text, isFetching: fetchingFile } = useErrorlessQuery<string>(
    {
      queryKey: ['public', 'file', 'files', filename],
      enabled: filename != 'new',
      queryFn: fetchPlainFile,
    },
    '下载文件',
  )
  const { uploadFile, uploadingFile } = useUploadFile()

  return {
    text,
    fetchingFile,
    uploadFile: useCallback((content: string, filename: string, type = 'text/plain') => {
      const blob = new Blob([content], { type })
      const file = new File([blob], filename, { type })
      return uploadFile({ file })
    }, []),
    uploadingFile,
  }
}

export function useLayerData(filename: string) {
  const { text, fetchingFile, uploadFile, uploadingFile } = usePlainTextFile(filename)
  const layerData = useMemo(() => {
    if (text) {
      try {
        return JSON.parse(text) as LayerData<any>[]
      } catch (e) {
        return [] as LayerData<any>[]
      }
    }
    return [] as LayerData<any>[]
  }, [text])

  return {
    layerData,
    fetchingLayer: fetchingFile,
    uploadLayer: useCallback(
      (layerData: LayerData<any>[]) =>
        uploadFile(JSON.stringify(layerData), 'config.json', 'application/json'),
      [],
    ),
    uploadingLayer: uploadingFile,
  }
}
export const emptyLayerFile: FileInfo = {
  id: 96,
  filename: '3df33176-01b2-4df9-b239-24640cf8526b',
  content_type: 'application/json',
  extension: 'json',
  created_at: '2023-07-14T10:53:15+08:00',
}

export function useFileInfo(filename?: string) {
  const { data: fileInfo, isFetching: fetchingFileInfo } = useErrorlessQuery<FileInfo>(
    {
      queryKey: ['public', 'file', 'file_info', { filename }],
      enabled: !!filename,
    },
    '获取文件信息失败',
  )

  return {
    fileInfo,
    fetchingFileInfo,
  }
}

export function useFileInfoById(id?: number) {
  const { data: fileInfo, isFetching: fetchingFileInfo } = useErrorlessQuery<FileInfo>(
    {
      queryKey: ['public', 'file', 'file_info', { id }],
      enabled: !!id,
    },
    '获取文件信息失败',
  )

  return {
    fileInfo,
    fetchingFileInfo,
  }
}
