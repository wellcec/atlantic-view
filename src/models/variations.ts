import { type AxiosResponse } from 'axios'
import type IBaseResponseType from './base'
import { type ISuccessResponse } from './base'

export interface TypeVariationType {
  uuid?: string
  title: string
  hasImages: boolean
  isUnique: boolean
  createdDate?: Date
  updatedDate?: Date
}

export interface ImageVariationType {
  uuid?: string
  uuidVariation?: string
  fileName: string
  createdDate?: Date
  updatedDate?: Date
}
export interface VariationType {
  uuid?: string
  uuidProduct?: string
  uuidTypeVariation?: string
  title: string
  typeVariation: TypeVariationType
  images: ImageVariationType[]
  createdDate?: Date
  updatedDate?: Date
}

export interface TypeVariationProductType {
  typeVariation: TypeVariationType
  variation: VariationType
}

export interface TypeVariationViewType {
  typeVariation: TypeVariationType
  variations: VariationType[]
}

export interface IResponseCreateTypeVariation extends ISuccessResponse {
  result: TypeVariationType
}

export interface IResponseTypeVariation extends IBaseResponseType {
  data: TypeVariationType[]
}

export interface IGetAllVariationsResponse {
  data: VariationType[]
  page: number
  pageSize: number
  count: number
}

export type GetAllVariationsType = AxiosResponse<IGetAllVariationsResponse, any>
