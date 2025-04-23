import axios from 'axios'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { type ISampleFilter } from '~/models'
import { type IGetAllProductsResponse } from '~/models/products'
import { productsQueryKeys } from './productsQueryKeys'

const getProducts = async (filter: ISampleFilter): Promise<IGetAllProductsResponse> => {
  const params: ISampleFilter = {
    term: filter.term,
    page: filter.page,
    pageSize: filter.pageSize,
    typeVariationId: filter.typeVariationId
  }

  const { data } = await axios.get<IGetAllProductsResponse>('api/products', { params })
  return data
}

export const useGetProducts = (filter: ISampleFilter, enabled: boolean = true): UseQueryResult<IGetAllProductsResponse, Error> => {
  return useQuery<IGetAllProductsResponse, Error>({
    queryKey: productsQueryKeys.pagination(filter),
    queryFn: () => getProducts(filter),
    retry: false,
    enabled,
    staleTime: 1000 * 60 * 5
  })
}
