import { Model } from '@/types/entity/model'
import { useErrorlessQuery, usePost, usePut, useDelete } from './common'
import { queryClient } from './queryClient'

type ModelCreatingForm = Pick<Model, 'file_id' | 'description' | 'private' | 'title'>

export function useModels(isPublic: boolean) {
  const { data: models, isFetching: fetchingModels } = useErrorlessQuery<Model[]>(
    {
      queryKey: ['private', 'algo', 'models', { all: Number(isPublic) }],
    },
    '获取算法列表',
  )
  const { mutate: createModel, isLoading: creatingModel } = usePost<Model, ModelCreatingForm>(
    ['private', 'algo', 'models'],
    '新建算法',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'models'])
      },
    },
  )

  return {
    models,
    fetchingModels,

    createModel,
    creatingModel,
  }
}

export function useModel(modelId: number) {
  const { data: model, isFetching: fetchingModel } = useErrorlessQuery<Model>(
    {
      queryKey: ['private', 'algo', 'models', modelId],
    },
    '获取算法信息',
  )
  const { mutate: updateModel, isLoading: updatingModel } = usePut<Model, ModelCreatingForm>(
    ['private', 'algo', 'models', modelId],
    '更新算法',
    {
      onSuccess: (model) => {
        queryClient.setQueryData(['private', 'algo', 'models', modelId], model)
        queryClient.invalidateQueries(['private', 'algo', 'models'], { exact: true })
      },
    },
  )
  const { mutate: deleteModel, isLoading: deletingModel } = useDelete(
    ['private', 'algo', 'models', modelId],
    '删除算法',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'algo', 'models'])
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
