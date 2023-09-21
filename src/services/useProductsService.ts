import { useCallback } from 'react'
import axios, { type AxiosResponse } from 'axios'
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

interface IUseProductsService {
  getProducts: (filter: ISampleFilter) => Promise<AxiosResponse<IGetAllProductsResponse, any>>
  createProduct: (product: CreateProductType) => Promise<AxiosResponse<ProductType | ISuccessResponse, any>>
  updateProduct: (id: string, product: CreateProductType) => Promise<AxiosResponse<any, any>>
  deleteProduct: (id: string) => Promise<AxiosResponse<any, any>>
  getAllImages: () => Promise<AxiosResponse<IGetAllImagesResponse, any>>
  uploadImage: (files: any[]) => Promise<AxiosResponse<ImageType, any>>
  deleteImageById: (id: string, idImage: string) => Promise<AxiosResponse<ISuccessResponse, any>>
  updateStatusProduct: (id: string, status: StatusProductType) => Promise<AxiosResponse<any, any>>
  getProductById: (id: string) => Promise<AxiosResponse<ProductType, any>>
  deleteTempImageById: (id: string) => Promise<AxiosResponse<ISuccessResponse, any>>
  getProductsByCategory: (id: string) => Promise<AxiosResponse<IGetAllProductsResponse, any>>
}

const useProductsService = (): IUseProductsService => {
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

  const getAllImages = useCallback(() => axios.get<IGetAllImagesResponse>('api/products/images/temporary'), [])

  const deleteImageById = useCallback((id: string, idImage: string) => axios.delete<ISuccessResponse>(`api/products/${id}/images/${idImage}`), [])

  const deleteTempImageById = useCallback((id: string) => axios.delete<ISuccessResponse>(`api/products/images/temporary/${id}`), [])

  const createProduct = useCallback((product: CreateProductType) => axios.post<ISuccessResponse | ProductType>('api/products', product), [])

  const updateStatusProduct = useCallback((id: string, status: StatusProductType) => axios.put<ISuccessResponse | any>(`api/products/status/${id}`, { status }, noLoading), [])

  const updateProduct = useCallback((id: string, product: CreateProductType) => axios.put<ISuccessResponse | any>(`api/products/${id}`, product), [])

  const deleteProduct = useCallback((id: string) => axios.delete<ISuccessResponse | any>(`api/products/${id}`), [])

  const getProductsByCategory = useCallback((id: string) => axios.get<IGetAllProductsResponse>(`api/products/byCategory/${id}`), [])

  return {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllImages,
    uploadImage,
    deleteImageById,
    updateStatusProduct,
    getProductById,
    deleteTempImageById,
    getProductsByCategory
  }
}

export default useProductsService
