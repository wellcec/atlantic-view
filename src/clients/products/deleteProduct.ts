import axios from 'axios'
import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { type ISampleFilter, type IResponseMutation } from '~/models'
import useAlerts from '~/shared/alerts/useAlerts'
import { productsQueryKeys } from './productsQueryKeys'

const deleteProduct = async (id: string): Promise<IResponseMutation> => {
  const { data } = await axios.delete<IResponseMutation>(`api/products/${id}`)
  return data
}

export const useDeleteProduct = (callback: () => void, filter: ISampleFilter): UseMutationResult<IResponseMutation, Error, string, void> => {
  const queryClient = useQueryClient()
  const { notifyError, notifySuccess } = useAlerts()

  return useMutation({
    mutationFn: deleteProduct,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: productsQueryKeys.pagination(filter) })
      callback()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.pagination(filter) })
      notifySuccess('Produto excluído com sucesso.')
    },
    onError: (error: Error) => {
      notifyError(`${error.name} - ${error.message}`)
    }
  })
}
