import { type AxiosResponse } from 'axios'
import type IBaseResponseType from './base'

export interface SubCategoryType {
  // id: string
  name: string
  createdDate?: Date
}

export interface CategoryType {
  id?: string
  name: string
  subCategories: SubCategoryType[]
  updatedDate?: Date
  createdDate?: Date
}

export interface IGetAllCategoriesResponse {
  data: CategoryType[]
  page: number
  pageSize: number
  count: number
}

export interface IResponseCreateCategory extends IBaseResponseType {
  result: CategoryType
}

export type GetAllCategoriesType = AxiosResponse<IGetAllCategoriesResponse, any>
