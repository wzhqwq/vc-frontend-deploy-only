import { LayerData } from '@/types/config/deepLearning'
import { QueryFunction, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { baseUrl } from './network'
import { useErrorlessQuery } from './common'

const fetchPlainFile: QueryFunction<string, string[]> = async ({ queryKey }) => {
  const filename = queryKey[3]
  const response = await fetch(`${baseUrl}file/files/${filename}`)
  if (response.status == 404) throw new Error('文件不存在')
  return response.text()
}

export function usePlainTextFile(filename: string) {
  const {
    data: text,
    isFetching: fetchingFile,
    isError: fetchFileError,
  } = useErrorlessQuery<string>({
    queryKey: ['public', 'file', 'files', filename],
    enabled: filename != 'new',
    queryFn: fetchPlainFile,
  })

  return { text, fetchingFile, fetchFileError }
}

export function useLayerData(filename: string) {
  const { text, fetchingFile, fetchFileError } = usePlainTextFile(filename)
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

  return { layerData, fetchingLayer: fetchingFile, fetchLayerError: fetchFileError }
}
