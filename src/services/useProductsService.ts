import { useCallback } from 'react'
import axios from 'axios'
import { ISuccessResponse } from 'models'

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

  return {
    uploadImage,
  }
}

export default useProductsService
