import axios from 'axios'
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import useError from '~/shared/hooks/useError'
import { type ISuccessResponse } from '~/models/base'
import { variationsQueryKeys } from './variationsQueryKeys'
import useAlerts from '~/shared/alerts/useAlerts'

const deleteTypeVariation = async (id: string): Promise<ISuccessResponse> => {
  const { data } = await axios.delete<ISuccessResponse>(`api/variations/type/${id}`)
  return data
}

export const useDeleteTypeVariation = (): UseMutationResult<ISuccessResponse, Error, string, unknown> => {
  const queryClient = useQueryClient()
  const { showErrorMsg } = useError()
  const { notifySuccess } = useAlerts()

  return useMutation({
    mutationFn: deleteTypeVariation,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: variationsQueryKeys.all })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variationsQueryKeys.all })
      notifySuccess('Tipo de variação excluída com sucesso.')
    },
    onError: (err) => {
      showErrorMsg(err)
    }
  })
}
