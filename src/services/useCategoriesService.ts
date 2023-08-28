import { useCallback } from 'react'
import axios from 'axios'
import { CategoryType, IGetAllCategoriesResponse } from 'models/categories'
import { ISampleFilter, ISuccessResponse } from 'models'

const useCategoriesService = () => {
  const getCategories = useCallback((filter: ISampleFilter) => axios.get<IGetAllCategoriesResponse>(`api/categories?term=${filter.term}&page=${filter.page}&pageSize=${filter.pageSize}`), [])

  const createCategory = useCallback((data: CategoryType) => axios.post<ISuccessResponse>('api/categories', data), [])

  const updateCategory = useCallback((id: string, data: CategoryType) => axios.put<ISuccessResponse>(`api/categories/${id}`, data), [])

  const deleteCategory = useCallback((id: string) => axios.delete<ISuccessResponse>(`api/categories/${id}`), [])

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}

export default useCategoriesService
