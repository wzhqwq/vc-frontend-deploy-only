import { LayerData } from '@/types/config/deepLearning'
import { QueryFunction, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { baseUrl, wrapAxios } from './network'
import { useErrorlessQuery, usePost } from './common'

const fetchPlainFile: QueryFunction<string, string[]> = async ({ queryKey }) => {
  const filename = queryKey[3]
  const response = await fetch(`${baseUrl}file/files/${filename}`)
  if (response.status == 404) throw new Error('文件不存在')
  return response.text()
}
const mutateUploadFile = async ({ file }: { file: File }) => {
  const data = new FormData()
  data.append('file', file)
  return await wrapAxios({
    url: baseUrl + '/file/files',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}

export function usePlainTextFile(filename: string) {
  const { data: text, isFetching: fetchingFile } = useErrorlessQuery<string>({
    queryKey: ['public', 'file', 'files', filename],
    enabled: filename != 'new',
    queryFn: fetchPlainFile,
  })
  const { mutateAsync: uploadFile, isLoading: uploadingFile } = usePost<string, { file: File }>(
    ['private', 'file', 'files'],
    {
      mutationFn: mutateUploadFile,
    },
  )

  return {
    text,
    fetchingFile,
    uploadFile: (content: string, type = 'text/plain') => {
      const blob = new Blob([content], { type })
      const file = new File([blob], filename)
      return uploadFile({ file })
    },
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
    uploadLayer: (layerData: LayerData<any>[]) =>
      uploadFile(JSON.stringify(layerData), 'application/json'),
    uploadingLayer: uploadingFile,
  }
}
