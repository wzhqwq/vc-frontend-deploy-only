import { Model } from '@/types/entity/model'
import { useErrorlessQuery, usePost, usePut, useDelete } from './common'
import { queryClient } from './queryClient'

type ModelCreatingForm = Pick<Model, 'file_id' | 'description' | 'private' | 'title'>

export function useModels(isPublic: boolean) {
  const { data: models, isFetching: fetchingModels } = useErrorlessQuery<Model[]>({
    queryKey: ['private', 'algo', 'models', { all: Number(isPublic) }],
  })
  const { mutate: createModel, isLoading: creatingModel } = usePost<
    Model,
    ModelCreatingForm
  >(['private', 'algo', 'models'], {
    onSuccess: () => {
      queryClient.invalidateQueries(['private', 'algo', 'models'])
    }
  })

  return {
    models,
    fetchingModels,

    createModel,
    creatingModel,
  }
}

export function useModel(modelId: number) {
  const { data: model, isFetching: fetchingModel } = useErrorlessQuery<Model>({
    queryKey: ['private', 'algo', 'models', modelId],
  })
  const { mutate: updateModel, isLoading: updatingModel } = usePut<
    Model,
    ModelCreatingForm
  >(['private', 'algo', 'models', modelId], {
    onSuccess: () => {
      queryClient.invalidateQueries(['private', 'algo', 'models', modelId])
    },
  })
  const { mutate: deleteModel, isLoading: deletingModel } = useDelete(
    ['private', 'algo', 'models', modelId],
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'models', modelId])
      },
    },
  )

  return {
    model,
    fetchingModel,

    updateModel,
    updatingModel,

    deleteModel,
    deletingModel,
  }
}
