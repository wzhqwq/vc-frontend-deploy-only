import { LayerData } from '@/types/config/deepLearning'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export function usePlainTextFile(filename: string) {
  const {
    data: text,
    isFetching: fetchingFile,
    isError: fetchFileError,
  } = useQuery<string, Error>({
    queryKey: ['public', 'file', 'files', filename],
    enabled: filename != 'new',
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
