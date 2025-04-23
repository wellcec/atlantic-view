import axios from 'axios'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type IResponseMutation } from '~/models'
import { type StatusProductType } from '~/models/products'
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
  const { notifyError } = useAlerts()

  return useMutation({
    mutationFn: updateStatusProduct,
    onError: (error: Error) => {
      notifyError(`${error.name} - ${error.message}`)
    }
  })
}
