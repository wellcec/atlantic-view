import axios from 'axios'
import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { variationsQueryKeys } from './variationsQueryKeys'
import { type TypeVariationType, type IResponseCreateTypeVariation } from '~/models/variations'
import useAlerts from '~/shared/alerts/useAlerts'
import useError from '~/shared/hooks/useError'

const createTypeVariation = async (typeVariation: TypeVariationType): Promise<IResponseCreateTypeVariation> => {
  const { data } = await axios.post<IResponseCreateTypeVariation>('api/variations/type/create', typeVariation)
  return data
}

export const useCreateTypeVariation = (): UseMutationResult<IResponseCreateTypeVariation, Error, TypeVariationType, void> => {
  const queryClient = useQueryClient()
  const { notifySuccess } = useAlerts()
  const { showErrorMsg } = useError()

  return useMutation({
    mutationFn: createTypeVariation,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: variationsQueryKeys.all })
    },
    onSuccess: () => {
      notifySuccess('Tipo de variação foi criado.')
    },
    onError: (err) => {
      showErrorMsg(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: variationsQueryKeys.all })
    }
  })
}
