import axios from 'axios'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import useError from '~/shared/hooks/useError'
import { type ISuccessResponse } from '~/models/base'

const deleteTempImage = async (images: string[]): Promise<ISuccessResponse> => {
  const { data } = await axios.post<ISuccessResponse>('api/images/delete/temp', { filesName: images })
  return data
}

export const useDeleteTempImageByName = (): UseMutationResult<ISuccessResponse, Error, string[], unknown> => {
  const { showErrorMsg } = useError()

  return useMutation({
    mutationFn: deleteTempImage,
    onError: (err) => {
      showErrorMsg(err)
    }
  })
}
