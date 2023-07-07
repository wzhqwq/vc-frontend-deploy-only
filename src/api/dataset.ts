import { Dataset } from '@/types/entity/dataset'
import { useErrorlessQuery, usePost, usePut, useDelete } from './common'
import { queryClient } from './queryClient'

type DatasetCreatingForm = Pick<Dataset, 'task_id' | 'description' | 'private' | 'title'>

export function useDatasets(isPublic: boolean) {
  const { data: datasets, isFetching: fetchingDatasets } = useErrorlessQuery<Dataset[]>({
    queryKey: ['private', 'algo', 'datasets', { all: Number(isPublic) }],
  })
  const { mutate: createDataset, isLoading: creatingDataset } = usePost<
    Dataset,
    DatasetCreatingForm
  >(['private', 'algo', 'datasets'], {
    onSuccess: () => {
      queryClient.invalidateQueries(['private', 'algo', 'datasets'])
    }
  })

  return {
    datasets,
    fetchingDatasets,

    createDataset,
    creatingDataset,
  }
}

export function useDataset(datasetId: number) {
  const { data: dataset, isFetching: fetchingDataset } = useErrorlessQuery<Dataset>({
    queryKey: ['private', 'algo', 'datasets', datasetId],
  })
  const { mutate: updateDataset, isLoading: updatingDataset } = usePut<
    Dataset,
    DatasetCreatingForm
  >(['private', 'algo', 'datasets', datasetId], {
    onSuccess: () => {
      queryClient.invalidateQueries(['private', 'algo', 'datasets', datasetId])
    },
  })
  const { mutate: deleteDataset, isLoading: deletingDataset } = useDelete(
    ['private', 'algo', 'datasets', datasetId],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'datasets', datasetId])
      },
    },
  )

  return {
    dataset,
    fetchingDataset,

    updateDataset,
    updatingDataset,

    deleteDataset,
    deletingDataset,
  }
}
