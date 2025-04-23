import axios from 'axios'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { variationsQueryKeys } from './variationsQueryKeys'
import { type IResponseTypeVariation } from '~/models/variations'

const getTypeVariations = async (): Promise<IResponseTypeVariation> => {
  const { data } = await axios.get<IResponseTypeVariation>('api/variations/type')
  return data
}

export const useGetTypeVariations = (): UseQueryResult<IResponseTypeVariation, Error> => {
  return useQuery<IResponseTypeVariation, Error>({
    queryKey: variationsQueryKeys.all,
    queryFn: () => getTypeVariations(),
    retry: false,
    staleTime: 1000 * 60 * 30
  })
}
