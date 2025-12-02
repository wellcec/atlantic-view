import axios from 'axios'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { type ISampleProductsFilter } from '~/models'
import { type IGetAllProductsResponse } from '~/models/products'
import { productsQueryKeys } from './productsQueryKeys'

const getProducts = async (filter: ISampleProductsFilter): Promise<IGetAllProductsResponse> => {
  const params: ISampleProductsFilter = {
    term: filter.term,
    page: filter.page,
    pageSize: filter.pageSize,
    typeVariationId: filter.typeVariationId,
    asc: filter.asc,
    categoryId: filter.categoryId,
    tags: filter.tags,
    minValue: filter.minValue,
    maxValue: filter.maxValue
  }

  const { data } = await axios.get<IGetAllProductsResponse>('api/products', { params })
  return data
}

export const useGetProducts = (filter: ISampleProductsFilter, enabled: boolean = true): UseQueryResult<IGetAllProductsResponse, Error> => {
  return useQuery<IGetAllProductsResponse, Error>({
    queryKey: productsQueryKeys.pagination(filter),
    queryFn: () => getProducts(filter),
    retry: false,
    enabled,
    staleTime: 1000 * 60 * 5
  })
}
