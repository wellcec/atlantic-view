import { type AxiosResponse } from 'axios'
import type IBaseResponseType from './base'
import { type ISuccessResponse } from './base'

export interface VariationType {
  id?: string
  idType?: string
  nameType?: string
  images?: string[]
  name: string
  createdDate?: Date
}

export interface TypeVariationType {
  id?: string
  name: string
  hasImages: boolean
  isUnique: boolean
  createdDate?: Date
}

export interface TypeVariationViewType extends TypeVariationType {
  variations?: VariationType[]
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
