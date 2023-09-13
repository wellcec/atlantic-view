import { useCallback } from 'react'
import axios, { type AxiosResponse } from 'axios'
import { type ISampleFilter, type ISuccessResponse } from 'models'
import { type VariationType, type IGetAllVariationsResponse } from 'models/variations'

const noLoading: any = {
  noLoading: true
}

interface IVariationsService {
  getVariations: (filter: ISampleFilter) => Promise<AxiosResponse<IGetAllVariationsResponse, any>>
  createVariation: (data: VariationType) => Promise<AxiosResponse<ISuccessResponse, any>>
  deleteVariation: (id: string) => Promise<AxiosResponse<ISuccessResponse, any>>
}

const useVariationsService = (): IVariationsService => {
  const getVariations = useCallback((filter: ISampleFilter) => axios.get<IGetAllVariationsResponse>(`api/variations?term=${filter.term}&page=${filter.page}&pageSize=${filter.pageSize}`, noLoading), [])

  const createVariation = useCallback((data: VariationType) => axios.post<ISuccessResponse>('api/variations', data), [])

  const deleteVariation = useCallback((id: string) => axios.delete<ISuccessResponse>(`api/variations/${id}`), [])

  return {
    getVariations,
    createVariation,
    deleteVariation
  }
}

export default useVariationsService
