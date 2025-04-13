import axios from 'axios'
import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { type CreateProductType, type IResponseProduct } from '~/models/products'
import { productsQueryKeys } from './productsQueryKeys'
import useAlerts from '~/shared/alerts/useAlerts'
import useError from '~/shared/hooks/useError'

const createProduct = async (product: CreateProductType): Promise<IResponseProduct> => {
  const { data } = await axios.post<IResponseProduct>('api/products/create', product)
  return data
}

export const useCreateProduct = (callback: () => void): UseMutationResult<IResponseProduct, Error, CreateProductType, void> => {
  const queryClient = useQueryClient()
  const { notifySuccess } = useAlerts()
  const { showErrorMsg } = useError()

  return useMutation({
    mutationFn: createProduct,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: productsQueryKeys.all })
    },
    onSuccess: () => {
      callback()
      notifySuccess('Produto criado com sucesso.')
    },
    onError: (err) => {
      showErrorMsg(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.all })
    }
  })
}
