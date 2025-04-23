import axios from 'axios'
import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { type IResponseMutation } from '~/models'
import { type CreateProductType } from '~/models/products'
import { productsQueryKeys } from './productsQueryKeys'
import useAlerts from '~/shared/alerts/useAlerts'

interface IProps {
  id: string
  product: CreateProductType
}

const updateProduct = async ({ id, product }: IProps): Promise<IResponseMutation> => {
  const { data } = await axios.put<IResponseMutation>(`api/products/update/${id}`, product)
  return data
}

export const useUpdateProduct = (productId: string, callback: () => void): UseMutationResult<IResponseMutation, any, IProps, unknown> => {
  const queryClient = useQueryClient()
  const { notifyError, notifySuccess } = useAlerts()

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: async () => {
      callback()

      await queryClient.invalidateQueries({ queryKey: productsQueryKeys.all })
      await queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(productId) })

      notifySuccess('Produto atualizado com sucesso.')
    },
    onError: (error: Error) => {
      notifyError(`${error.name} - ${error.message}`)
    },
    onSettled: async () => {
      // await queryClient.refetchQueries({ queryKey: productsQueryKeys.detail(productId) })
    }
  })
}
