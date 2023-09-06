import { useCallback } from 'react'
import axios from 'axios'
import { type ISampleFilter, type ISuccessResponse } from 'models'
import {
  type ImageType,
  type CreateProductType,
  type IGetAllImagesResponse,
  type IGetAllProductsResponse,
  type ProductType,
  type StatusProductType
} from 'models/products'

const noLoading: any = {
  noLoading: true
}

const useProductsService = () => {
  const uploadImage = useCallback((files: any[]) => {
    const data = new FormData()

    files.forEach((file) => {
      data.append('files', file)
    })

    return axios.post<ImageType>('api/products/images/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }, [])

  const getProducts = useCallback((filter: ISampleFilter) => axios
    .get<IGetAllProductsResponse>(`api/products?term=${filter.term}&page=${filter.page}&pageSize=${filter.pageSize}`), [])

  const getProductById = useCallback((id: string) => axios.get<ProductType>(`api/products/${id}`), [])

  const getAllImages = useCallback(() => axios.get<IGetAllImagesResponse>('api/products/images/temp'), [])

  const deleteImageById = useCallback((id: string) => axios.delete<ISuccessResponse>(`api/products/images/${id}`), [])

  const createProduct = useCallback((product: CreateProductType) => axios.post<ISuccessResponse | ProductType>('api/products', product), [])

  const updateStatusProduct = useCallback((id: string, status: StatusProductType) => axios.put<ISuccessResponse | any>(`api/products/status/${id}`, { status }, noLoading), [])

  const updateProduct = useCallback((id: string, product: CreateProductType) => axios.put<ISuccessResponse | any>(`api/products/${id}`, product), [])

  const deleteProduct = useCallback((id: string) => axios.delete<ISuccessResponse | any>(`api/products/${id}`), [])

  return {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllImages,
    uploadImage,
    deleteImageById,
    updateStatusProduct,
    getProductById
  }
}

export default useProductsService
