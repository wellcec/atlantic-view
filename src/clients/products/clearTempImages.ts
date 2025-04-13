import axios from 'axios'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import useAlerts from '~/shared/alerts/useAlerts'

const clearTempImages = async (): Promise<any> => {
  const { data } = await axios.delete('api/images/clear')
  return data
}

export const useClearTempImages = (): UseMutationResult<any, Error, void, unknown> => {
  const { notifyError } = useAlerts()

  return useMutation({
    mutationFn: clearTempImages,
    onError: (error: Error) => {
      notifyError(`${error.name} - ${error.message}`)
    }
  })
}
