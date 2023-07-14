import { Dataset } from '@/types/entity/dataset'
import { useErrorlessQuery, usePost, usePut, useDelete } from './common'
import { queryClient } from './queryClient'
import { useCallback } from 'react'
import { ServerGeneratedKeys } from '@/types/entity/common'

export function useDatasets(isPublic: boolean, search?: string) {
  const { data: datasets, isFetching: fetchingDatasets } = useErrorlessQuery<Dataset[]>(
    {
      queryKey: ['private', 'algo', 'datasets', { all: Number(isPublic), search }],
    },
    '获取数据集列表',
  )
  return {
    datasets,
    fetchingDatasets,
  }
}

export type DatasetCreatingForm = Omit<Dataset, ServerGeneratedKeys>
export function useCreateDataset() {
  const { mutateAsync: createDataset, isLoading: creatingDataset } = usePost<
    Dataset,
    DatasetCreatingForm
  >(['private', 'algo', 'datasets'], '新建数据集', {
    onSuccess: () => {
      queryClient.invalidateQueries(['private', 'algo', 'datasets'])
    },
  })

  return {
    createDataset,
    creatingDataset,
  }
}

export function useDataset(datasetId: number) {
  const { data: dataset, isFetching: fetchingDataset } = useErrorlessQuery<Dataset>(
    {
      queryKey: ['private', 'algo', 'datasets', datasetId],
    },
    '获取数据集信息',
  )
  const { mutateAsync: updateDataset, isLoading: updatingDataset } = usePut<
    Dataset,
    DatasetCreatingForm
  >(['private', 'algo', 'datasets', datasetId], '更新数据集', {
    onSuccess: (dataset) => {
      queryClient.setQueryData(['private', 'algo', 'datasets', datasetId], dataset)
      queryClient.invalidateQueries(['private', 'algo', 'datasets'], { exact: true })
    },
  })
  const { mutate: deleteDataset, isLoading: deletingDataset } = useDelete(
    ['private', 'algo', 'datasets', datasetId],
    '删除数据集',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'datasets'])
      },
    },
  )

  return {
    dataset,
    fetchingDataset,

    updateDataset,
    updatingDataset,

    deleteDataset: useCallback(() => deleteDataset(undefined), [deleteDataset]),
    deletingDataset,
  }
}
