import { useCallback } from 'react'
import axios from 'axios'
import { ISampleFilter, ISuccessResponse } from 'models'
import { VariationType, IGetAllVariationsResponse } from 'models/variations'

const useVariationsService = () => {
  const getVariations = useCallback((filter: ISampleFilter) => axios.get<IGetAllVariationsResponse>(`api/variations?term=${filter.term}&page=${filter.page}&pageSize=${filter.pageSize}`), [])

  const createVariation = useCallback((data: VariationType) => axios.post<ISuccessResponse>('api/variations', data), [])

  const deleteVariation = useCallback((id: string) => axios.delete<ISuccessResponse>(`api/variations/${id}`), [])

  return {
    getVariations,
    createVariation,
    deleteVariation,
  }
}

export default useVariationsService
