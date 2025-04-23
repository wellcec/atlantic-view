import axios from 'axios'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import useError from '~/shared/hooks/useError'
import { type ISuccessResponse } from '~/models/base'

const deleteDefinitiveImage = async (images: string[]): Promise<ISuccessResponse> => {
  const { data } = await axios.post<ISuccessResponse>('api/images/delete/definitive', { filesName: images })
  return data
}

export const useDeleteDefinitiveImage = (): UseMutationResult<ISuccessResponse, Error, string[], unknown> => {
  const { showErrorMsg } = useError()

  return useMutation({
    mutationFn: deleteDefinitiveImage,
    onError: (err) => {
      showErrorMsg(err)
    }
  })
}
