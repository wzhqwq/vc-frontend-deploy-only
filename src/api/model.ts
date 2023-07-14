import { Model } from '@/types/entity/model'
import { useErrorlessQuery, usePost, usePut, useDelete } from './common'
import { queryClient } from './queryClient'
import { useCallback } from 'react'
import { ServerGeneratedKeys } from '@/types/entity/common'

export function useModels(isPublic: boolean, search?: string) {
  const { data: models, isFetching: fetchingModels } = useErrorlessQuery<Model[]>(
    {
      queryKey: ['private', 'model', 'models', { all: Number(isPublic), search }],
    },
    '获取算法列表',
  )
  return {
    models,
    fetchingModels,
  }
}

export type ModelCreatingForm = Omit<Model, ServerGeneratedKeys>
export function useCreateModel() {
  const { mutateAsync: createModel, isLoading: creatingModel } = usePost<Model, ModelCreatingForm>(
    ['private', 'model', 'models'],
    '新建算法',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'model', 'models'])
      },
    },
  )

  return {
    createModel,
    creatingModel,
  }
}

export function useModel(modelId: number) {
  const { data: model, isFetching: fetchingModel } = useErrorlessQuery<Model>(
    {
      queryKey: ['private', 'model', 'models', modelId],
    },
    '获取算法信息',
  )
  const { mutateAsync: updateModel, isLoading: updatingModel } = usePut<Model, ModelCreatingForm>(
    ['private', 'model', 'models', modelId],
    '更新算法',
    {
      onSuccess: (model) => {
        queryClient.setQueryData(['private', 'model', 'models', modelId], model)
        queryClient.invalidateQueries(['private', 'model', 'models'], { exact: true })
      },
    },
  )
  const { mutate: deleteModel, isLoading: deletingModel } = useDelete(
    ['private', 'model', 'models', modelId],
    '删除算法',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'model', 'models'])
      },
    },
  )

  return {
    model,
    fetchingModel,

    updateModel,
    updatingModel,

    deleteModel: useCallback(() => deleteModel(undefined), []),
    deletingModel,
  }
}
