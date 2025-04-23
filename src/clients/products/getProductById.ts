import axios from 'axios'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { type IResponseProduct } from '~/models/products'
import { productsQueryKeys } from './productsQueryKeys'

const getProductById = async (id: string): Promise<IResponseProduct> => {
  const { data } = await axios.get<IResponseProduct>(`api/products/${id}`)
  return data
}

export const useGetProductById = (id: string): UseQueryResult<IResponseProduct, Error> => {
  return useQuery<IResponseProduct, Error>({
    queryKey: productsQueryKeys.detail(id),
    queryFn: async () => await getProductById(id),
    enabled: id !== '',
    staleTime: 1000 * 60 * 5
  })
}
