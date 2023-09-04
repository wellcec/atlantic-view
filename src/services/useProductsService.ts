import { useCallback } from 'react'
import axios from 'axios'
import { ISampleFilter, ISuccessResponse } from 'models'
import {
  CreateProductType, IGetAllImagesResponse, IGetAllProductsResponse, ProductType,
} from 'models/products'

const useProductsService = () => {
  const uploadImage = useCallback((files: any[]) => {
    const data = new FormData()

    files.forEach((file) => {
      data.append('files', file)
    })

    return axios.post<ISuccessResponse>('api/products/images/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }, [])

  const getProducts = useCallback((filter: ISampleFilter) => axios
    .get<IGetAllProductsResponse>(`api/products?term=${filter.term}&page=${filter.page}&pageSize=${filter.pageSize}`), [])

  const getAllImages = useCallback(() => axios.get<IGetAllImagesResponse>('api/products/images/temp'), [])

  const deleteImageById = useCallback((id: string) => axios.delete<ISuccessResponse>(`api/products/images/${id}`), [])

  const createProduct = useCallback((product: CreateProductType) => axios.post<ISuccessResponse | ProductType>('api/products', product), [])

  return {
    getProducts,
    createProduct,
    getAllImages,
    uploadImage,
    deleteImageById,
  }
}

export default useProductsService
