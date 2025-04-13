import axios from 'axios'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { type ISampleFilter } from '~/models'
import { type IGetAllProductsResponse } from '~/models/products'
import { productsQueryKeys } from './productsQueryKeys'

const getProducts = async (filter: ISampleFilter): Promise<IGetAllProductsResponse> => {
  const { data } = await axios.get<IGetAllProductsResponse>('api/products', {
    params: {
      term: filter.term,
      page: filter.page,
      pageSize: filter.pageSize
    }
  })
  return data
}

export const useGetProducts = (filter: ISampleFilter): UseQueryResult<IGetAllProductsResponse, Error> => {
  return useQuery<IGetAllProductsResponse, Error>({
    queryKey: productsQueryKeys.pagination(filter),
    queryFn: () => getProducts(filter),
    retry: false,
    staleTime: 1000 * 60 * 5
  })
}
