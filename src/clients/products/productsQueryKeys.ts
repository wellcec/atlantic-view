import { type ISampleFilter } from '~/models'
import LoadingQueryKeys from '../constants'

export const productsQueryKeys = {
  all: [LoadingQueryKeys.global, 'products'],
  detail: (id: string) => [...productsQueryKeys.all, 'detail', id],
  pagination: (filter: ISampleFilter) => [...productsQueryKeys.all, filter]
}
