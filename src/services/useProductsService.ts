import { useCallback } from 'react'
import axios from 'axios'
import { ISuccessResponse } from 'models'
import { IGetAllImagesResponse } from 'models/products'

const useProductsService = () => {
  const uploadImage = useCallback((files: any[]) => {
    const data = new FormData()

    files.forEach((file) => {
      data.append('files', file)
    })

    return axios.post<ISuccessResponse>('api/products/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }, [])

  const getImages = useCallback(() => axios.get<IGetAllImagesResponse>('api/products/images'), [])

  return {
    getImages,
    uploadImage,
  }
}

export default useProductsService
