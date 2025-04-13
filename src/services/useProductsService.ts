import { useCallback } from 'react'
import axios, { type AxiosResponse } from 'axios'
import { type IResponseMutation, type ISampleFilter } from 'models'
import {
  type ImageType,
  type CreateProductType,
  type IGetAllProductsResponse,
  type StatusProductType,
  type IResponseProduct
} from 'models/products'
import { type ISuccessResponse } from '~/models/base'

const noLoading: any = {
  noLoading: true
}

interface IUseProductsService {
  getProducts: (filter: ISampleFilter) => Promise<AxiosResponse<IGetAllProductsResponse, any>>
  createProduct: (product: CreateProductType) => Promise<AxiosResponse<IResponseProduct, any>>
  updateProduct: (id: string, product: CreateProductType) => Promise<AxiosResponse<any, any>>
  deleteProduct: (id: string) => Promise<AxiosResponse<IResponseMutation, any>>
  getTempImages: () => Promise<AxiosResponse<ImageType[], any>>
  clearTempImages: () => Promise<AxiosResponse<any, any>>
  uploadTempImage: (files: any[]) => Promise<AxiosResponse<{ result: ImageType }, any>>
  uploadImage: (files: any[]) => Promise<AxiosResponse<{ result: ImageType }, any>>
  deleteImageById: (id: string, idImage: string) => Promise<AxiosResponse<ISuccessResponse, any>>
  updateStatusProduct: (id: string, status: StatusProductType) => Promise<AxiosResponse<IResponseMutation, any>>
  getProductById: (id: string) => Promise<AxiosResponse<IResponseProduct, any>>
  deleteTempImageByName: (files: string[]) => Promise<AxiosResponse<ISuccessResponse, any>>
}

const useProductsService = (): IUseProductsService => {
  const uploadImage = useCallback((files: any[]) => {
    const data = new FormData()

    files.forEach((file) => {
      data.append('file', file)
    })

    return axios.post<{ result: ImageType }>('api/images/save/definitive', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }, [])

  const uploadTempImage = useCallback((files: any[]) => {
    const data = new FormData()

    files.forEach((file) => {
      data.append('file', file)
    })

    return axios.post<{ result: ImageType }>('api/images/save/temp', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }, [])

  const getProducts = useCallback((filter: ISampleFilter) => axios.get<IGetAllProductsResponse>(`api/products?term=${filter.term}&page=${filter.page}&pageSize=${filter.pageSize}`), [])

  const getProductById = useCallback((id: string) => axios.get<IResponseProduct>(`api/products/${id}`), [])

  const getTempImages = useCallback(() => axios.get<ImageType[]>('api/images/all/temporary'), [])

  const clearTempImages = useCallback(() => axios.delete('api/images/clear'), [])

  const deleteImageById = useCallback((id: string, idImage: string) => axios.delete<ISuccessResponse>(`api/products/${id}/images/${idImage}`), [])

  const deleteTempImageByName = useCallback((files: string[]) => axios.post<ISuccessResponse>('api/images/delete/temp', { filesName: files }), [])

  const createProduct = useCallback((product: CreateProductType) => axios.post<IResponseProduct>('api/products/create', product), [])

  const updateStatusProduct = useCallback((id: string, status: StatusProductType) => axios.put<IResponseMutation>(`api/products/status/${id}`, status, noLoading), [])

  const updateProduct = useCallback((id: string, product: CreateProductType) => axios.put<ISuccessResponse | any>(`api/products/${id}`, product), [])

  const deleteProduct = useCallback((id: string) => axios.delete<IResponseMutation>(`api/products/${id}`), [])

  return {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getTempImages,
    clearTempImages,
    uploadImage,
    uploadTempImage,
    deleteImageById,
    updateStatusProduct,
    getProductById,
    deleteTempImageByName
  }
}

export default useProductsService
