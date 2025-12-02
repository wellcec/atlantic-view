import { useCallback } from 'react'
import axios, { type AxiosResponse } from 'axios'
import { type IResponseCreateCategory, type IGetAllCategoriesResponse, type CategoryType } from 'models/categories'
import { type IResponseMutation, type ISampleFilter } from 'models'
import { type IResponseProductsByCategory } from '~/models/products'
import type IBaseResponseType from '~/models/base'

interface ICategoriesService {
  getCategories: (filter: ISampleFilter) => Promise<AxiosResponse<IGetAllCategoriesResponse, any>>
  productByCategory: (id: string) => Promise<AxiosResponse<IResponseProductsByCategory, any>>
  createCategory: (data: CategoryType) => Promise<AxiosResponse<IBaseResponseType, any>>
  updateCategory: (id: string, data: CategoryType) => Promise<AxiosResponse<IBaseResponseType, any>>
  deleteCategory: (id: string) => Promise<AxiosResponse<IBaseResponseType, any>>
}

const useCategoriesService = (): ICategoriesService => {
  const getCategories = useCallback((filter: ISampleFilter) => axios
    .get<IGetAllCategoriesResponse>(`api/categories?term=${filter.term}&page=${filter.page}&pageSize=${filter.pageSize}`), [])

  const productByCategory = useCallback((id: string) => axios.get<IResponseProductsByCategory>(`api/categories/${id}/products`), [])

  const createCategory = useCallback((data: CategoryType) => axios.post<IResponseCreateCategory>('api/categories/create', data), [])

  const updateCategory = useCallback((id: string, data: CategoryType) => axios.put<IResponseMutation>(`api/categories/${id}`, data), [])

  const deleteCategory = useCallback((id: string) => axios.delete<IResponseMutation>(`api/categories/${id}`), [])

  return {
    getCategories,
    productByCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
}

export default useCategoriesService
