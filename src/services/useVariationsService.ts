import { useCallback } from 'react'
import axios, { type AxiosResponse } from 'axios'
import { type ISampleFilter } from 'models'
import { type VariationType, type IGetAllVariationsResponse, type IResponseTypeVariation, type TypeVariationType, type IResponseCreateTypeVariation } from 'models/variations'
import { type ISuccessResponse } from '~/models/base'

const noLoading: any = {
  noLoading: true
}

interface IVariationsService {
  getVariations: (filter: ISampleFilter) => Promise<AxiosResponse<IGetAllVariationsResponse, any>>
  createVariation: (data: VariationType) => Promise<AxiosResponse<ISuccessResponse, any>>
  deleteVariation: (id: string) => Promise<AxiosResponse<ISuccessResponse, any>>
  getTypeVariations: () => Promise<AxiosResponse<IResponseTypeVariation, any>>
  createTypeVariation: (data: TypeVariationType) => Promise<AxiosResponse<IResponseCreateTypeVariation, any>>
}

const useVariationsService = (): IVariationsService => {
  const getVariations = useCallback((filter: ISampleFilter) => axios.get<IGetAllVariationsResponse>(`api/variations?term=${filter.term}&page=${filter.page}&pageSize=${filter.pageSize}`, noLoading), [])

  const createVariation = useCallback((data: VariationType) => axios.post<ISuccessResponse>('api/variations', data), [])

  const deleteVariation = useCallback((id: string) => axios.delete<ISuccessResponse>(`api/variations/${id}`), [])

  const getTypeVariations = useCallback(() => axios.get<IResponseTypeVariation>('api/variations/type', noLoading), [])

  const createTypeVariation = useCallback((data: TypeVariationType) => axios.post<IResponseCreateTypeVariation>('api/variations/type/create', data), [])

  return {
    getVariations,
    createVariation,
    deleteVariation,
    getTypeVariations,
    createTypeVariation
  }
}

export default useVariationsService
