import type React from 'react'
import { type AxiosResponse } from 'axios'
import { type CategoryType } from './categories'

export interface ImageType {
  _id: string
  fileName: string
  base64: string
  createdDate: Date
}

export interface TagType {
  _id: string
  name: string
}

export interface VariantionType {
  _id: string
  name: string
}

export interface StatusProductType {
  isActive?: boolean
  isHighlighted?: boolean
  isLaunch?: boolean
  isSale?: boolean
  isBestSeller?: boolean
  isPreOrder?: boolean
}

export type StatusProductProps = keyof StatusProductType

export interface ProductType {
  _id?: string
  title: string
  subtitle: string
  value: number
  valueUnique: number
  weight: number
  height: number
  length: number
  width: number
  categories: CategoryType[]
  images: ImageType[]
  variations: VariantionType[]
  tags: TagType[]
  status: StatusProductType
  shipping: string
  createdDate: Date
  updatedDate: Date
}

export type CreateProductType = Omit<ProductType, '_id' | 'createdDate' | 'updatedDate'>

export interface IGetAllProductsResponse {
  data: ProductType[]
  page: number
  pageSize: number
  count: number
}

export type GetAllProductsType = AxiosResponse<IGetAllProductsResponse, any>

export interface IGetAllImagesResponse {
  data: ImageType[]
}

export type Mode = 'create' | 'update' | 'list'

export const MODES = {
  create: 'create' as Mode,
  update: 'update' as Mode,
  list: 'list' as Mode
}

export interface IProductsContext {
  product?: ProductType
  setProduct: React.Dispatch<React.SetStateAction<ProductType | undefined>>
  mode: Mode
  setMode: React.Dispatch<React.SetStateAction<Mode>>
}
