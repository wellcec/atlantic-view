import axios from 'axios'
import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { type IResponseMutation } from '~/models'
import { type StatusProductType } from '~/models/products'
import { productsQueryKeys } from './productsQueryKeys'
import useAlerts from '~/shared/alerts/useAlerts'

interface IProps {
  id: string
  status: StatusProductType
}

const updateStatusProduct = async ({ id, status }: IProps): Promise<IResponseMutation> => {
  const { data } = await axios.put<IResponseMutation>(`api/products/status/${id}`, status)
  return data
}

export const useUpdateStatusProduct = (): UseMutationResult<IResponseMutation, any, IProps, unknown> => {
  const queryClient = useQueryClient()
  const { notifyError } = useAlerts()

  return useMutation({
    mutationFn: updateStatusProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...productsQueryKeys.all] })
    },
    onError: (error: Error) => {
      notifyError(`${error.name} - ${error.message}`)
    }
  })
}
